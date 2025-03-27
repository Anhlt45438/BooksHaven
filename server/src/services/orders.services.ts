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
    const itemsClone = JSON.parse(JSON.stringify(items));

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

    // Process orders
    const orderPromises = items.map(async (item) => {
      const bookTotal = await paymentService.calculateBooksTotal([
        { id_sach: item.id_sach, so_luong: item.so_luong }
      ]);
      
      const book = books.find((b) => b.id_sach?.toString() === item.id_sach);
      
      

      const order = new DonHang({
        id_don_hang: new ObjectId(),
        id_user: new ObjectId(userId),
        id_shop: new ObjectId(book?.id_shop),
        ngay_mua: new Date(),
        tong_tien: bookTotal.total_amount,
        trang_thai: TrangThaiDonHangStatus.chua_thanh_toan
      });

      const orderDetail = new ChiTietDonHang({
        id_ctdh: new ObjectId(),
        id_don_hang: order.id_don_hang as ObjectId,
        id_sach: new ObjectId(item.id_sach),
        so_luong: item.so_luong
      });

      await Promise.all([
        databaseServices.orders.insertOne(order),
        databaseServices.orderDetails.insertOne(orderDetail)
      ]);

      return { order, detail: orderDetail };
    });

    return Promise.all(orderPromises);
  }

  async getOrdersByPaymentStatusForShop(userId: string, isPaid: boolean, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const paidStatus = [
      TrangThaiDonHangStatus.cho_xac_nhan, 
      TrangThaiDonHangStatus.da_nhan_hang, 
      TrangThaiDonHangStatus.dang_chuan_bi, 
      TrangThaiDonHangStatus.dang_giao_hang,
      TrangThaiDonHangStatus.da_hoan_thanh_don
    ];
    const status = isPaid ? 
    paidStatus : 
    [TrangThaiDonHangStatus.chua_thanh_toan];
    
    const shop = await databaseServices.shops.findOne({ id_user: new ObjectId(userId) });
    if (!shop) {
      throw new Error('Shop not found for this user');
    }
    const shopId = shop.id_shop;
    const [orders, total] = await Promise.all([
      databaseServices.orders
        .find({
          id_shop: (shopId),
          trang_thai: { $in: status } 
        })
        .sort({ ngay_mua: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      databaseServices.orders.countDocuments({
        id_shop: (shopId),
        trang_thai: { $in: status }
      })
    ]);


    // Calculate monthly revenue from orders
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const monthlyRevenue = await databaseServices.orders
      .find({
        id_shop: shopId,
        ngay_mua: {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth
        },
        trang_thai: { 
          $in: paidStatus
        }
      })
      .toArray()
      .then(orders => orders.reduce((sum, order) => sum + (order.tong_tien || 0), 0));

    return {
      orders: orders,
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit)
      },
      monthly_revenue: monthlyRevenue
    };
  }
}

const ordersService = new OrdersService();
export default ordersService;