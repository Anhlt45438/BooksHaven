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
}

const ordersService = new OrdersService();
export default ordersService;