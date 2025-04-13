import { ObjectId } from 'mongodb';
import databaseServices from './database.services';
import DonHang from '~/models/schemas/DonHang.schemas';
import ChiTietDonHang from '~/models/schemas/ChiTietDonHang.schemas';
import { TrangThaiDonHangStatus } from '~/constants/enum';
import paymentService from './payments.services';
import Sach from '~/models/schemas/Sach.schemas';
import { transporter } from '~/controllers/users.controllers';
import { generateBillHTML } from '~/utils/bill.utils';

interface OrderItem {
  id_sach: string;
  so_luong: number;
}

class OrdersService {
  async createOrders(userId: string, items: OrderItem[]) {
    const books: Array<Sach> = [];
    const itemsClone: Array<Sach> = JSON.parse(JSON.stringify(items));

    // Validate books and quantities
    for (const item of itemsClone) {
      const book = await databaseServices.books.findOne({ 
        _id: new ObjectId(item.id_sach) 
      });
      
      if (!book) {
        throw new Error(`Book with ID ${item.id_sach} not found`);
      }
      
      if (book.so_luong < item.so_luong) {
        throw new Error(`Book "${book.ten_sach}" is out of stock. Available: ${book.so_luong}`);
      }
      
      books.push(book);
    }

    // Group items by shop
    const itemsByShop = books.reduce((acc, book) => {
      const shopId = book.id_shop?.toString();
      if (!shopId) return acc;
      
      if (!acc[shopId]) {
        acc[shopId] = [];
      }
      
      const orderItem = itemsClone.find(item => item.id_sach?.toString() === book.id_sach?.toString());
      if (orderItem) {
        acc[shopId].push({
          book,
          quantity: orderItem.so_luong
        });
      }
      
      return acc;
    }, {} as Record<string, Array<{ book: Sach; quantity: number }>>);
    const id_don_hang = new ObjectId();
    // Process orders by shop
    const orderPromises = Object.entries(itemsByShop).map(async ([shopId, shopItems]) => {
      // Calculate total for all items in this shop's order
      const total = await paymentService.calculateBooksTotal(
        shopItems.map(item => ({
          id_sach: item.book?.id_sach?.toString() || "",
          so_luong: item.quantity
        }))
      );
      const user = await databaseServices.users.findOne({ _id: new ObjectId(userId) });
      const order = new DonHang({
        id_don_hang: new ObjectId(),
        id_user: new ObjectId(userId),
        id_shop: new ObjectId(shopId),
        ngay_mua: new Date(),
        dia_chi: user?.dia_chi || "",
        tong_tien: total.total_amount,
        trang_thai: TrangThaiDonHangStatus.chua_thanh_toan
      });

      // Create order details for each item
      const orderDetails = shopItems.map(item => new ChiTietDonHang({
        id_ctdh: new ObjectId(),
        id_don_hang: order.id_don_hang as ObjectId,
        id_sach: new ObjectId(item.book?.id_sach?.toString() || ""),
        so_luong: item.quantity
      }));

      await Promise.all([
        databaseServices.orders.insertOne(order),
        databaseServices.orderDetails.insertMany(orderDetails)
      ]);

      return {
        order,
        details: orderDetails
      };
    });

    return Promise.all(orderPromises);
  }

  async getOrdersByPaymentStatusForShop(
    userId: string, 
    isPaid: boolean, 
    page = 1, 
    limit = 10,
    startDate?: Date,
    endDate?: Date
  ) {
    const skip = (page - 1) * limit;
    const paidStatus = [
      TrangThaiDonHangStatus.cho_xac_nhan, 
      TrangThaiDonHangStatus.da_nhan_hang, 
      TrangThaiDonHangStatus.dang_chuan_bi, 
      TrangThaiDonHangStatus.dang_giao_hang,
    ];
    const status = isPaid ? paidStatus : [TrangThaiDonHangStatus.chua_thanh_toan];
    
    const shop = await databaseServices.shops.findOne({ id_user: new ObjectId(userId) });
    if (!shop) {
      throw new Error('Shop not found for this user');
    }
    const shopId = shop.id_shop;

    // Build query with optional date range
    const query: any = {
      id_shop: shopId,
      trang_thai: { $in: status }
    };

    if (startDate || endDate) {
      query.ngay_mua = {};
      if (startDate) {
        query.ngay_mua.$gte = new Date(startDate);
      }
      if (endDate) {
        query.ngay_mua.$lte = new Date(endDate);
      }
    }

    const [orders, total] = await Promise.all([
      databaseServices.orders
        .find(query)
        .sort({ ngay_mua: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      databaseServices.orders.countDocuments(query)
    ]);

    

    return {
      orders: orders,
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit)
      },
      date_range: {
        start: startDate || null,
        end: endDate || null
      }
    };
  }
  async getBillHtml (orders: DonHang[], orderDetails: ChiTietDonHang[], paymentId: string) {
    const bookIds = orderDetails.map(detail => detail.id_sach);
    const books = await databaseServices.books.find({ id_sach: { $in: bookIds } }).toArray();
   
    const user = await databaseServices.users.findOne({ _id: orders[0].id_user});
    const items = orderDetails.map(detail => {
      const book = books.find(book => book.id_sach?.toString() === detail.id_sach?.toString());
      return {
        ten_sach: book?.ten_sach || '',
        // giam_gia: book?.giam_gia || 'Không',
        giam_gia: 'Không',
        so_luong: detail.so_luong,
        don_gia: book?.gia || 0,
        thanh_tien: book?.gia ? book.gia * detail.so_luong : 0
      } 
    })
    let tong_tien:number = orders.reduce((acc, order) => acc + order.tong_tien, 0);
    const billHTML = await generateBillHTML({
      username: user!.username || '',
      dia_chi:orders[0].dia_chi ||  user!.dia_chi || '',
      sdt: user!.sdt || '',
      id_don_hang: paymentId,
      items: items,
      tong_tien: tong_tien,
      tong_tien_ship:  Math.max(0, tong_tien - items.reduce((acc, item) => acc + item.thanh_tien, 0))
    });
    return  billHTML;

  }

  async sendOrderBillEmail(id_don_hangs: ObjectId[], paymentId: string) {
    const orders = await databaseServices.orders.find({ id_don_hang: { $in: id_don_hangs } }).toArray();
    const ordersDetails = await databaseServices.orderDetails.find({ id_don_hang: { $in: id_don_hangs } }).toArray();
    const user = await databaseServices.users.findOne({ _id: orders[0].id_user});
    const billHTML = await this.getBillHtml(orders, ordersDetails , paymentId);

    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user!.email,
      subject: `Hóa đơn mua hàng, đã thanh toán #${paymentId} - Books Haven`,
      html: billHTML
    });
    return true;
  }
}

const ordersService = new OrdersService();
export default ordersService;