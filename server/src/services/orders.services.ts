import { ObjectId } from 'mongodb';
import databaseServices from './database.services';
import DonHang from '~/models/schemas/DonHang.schemas';
import ChiTietDonHang from '~/models/schemas/ChiTietDonHang.schemas';
import { TrangThaiDonHangStatus } from '~/constants/enum';
import paymentService from './payments.services';
import Sach from '~/models/schemas/Sach.schemas';

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

    // Process orders by shop
    const orderPromises = Object.entries(itemsByShop).map(async ([shopId, shopItems]) => {
      // Calculate total for all items in this shop's order
      const total = await paymentService.calculateBooksTotal(
        shopItems.map(item => ({
          id_sach: item.book?.id_sach?.toString() || "",
          so_luong: item.quantity
        }))
      );

      const order = new DonHang({
        id_don_hang: new ObjectId(),
        id_user: new ObjectId(userId),
        id_shop: new ObjectId(shopId),
        ngay_mua: new Date(),
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
}

const ordersService = new OrdersService();
export default ordersService;