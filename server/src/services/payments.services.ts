import { ObjectId } from 'mongodb';
import databaseServices from './database.services';

const SHIPPING_COST = 30000; // 30,000 VND shipping cost per book

class PaymentService {
  async calculateBooksTotal(items: { id_sach: string; so_luong: number }[]) {
    // Convert string IDs to ObjectIds
    const objectIds = items.map(item => new ObjectId(item.id_sach));

    // Get books information
    const books = await databaseServices.books
      .find({ _id: { $in: objectIds } })
      .toArray();

    // Calculate total with quantity and shipping cost
    const booksWithShipping = books.map(book => {
      const orderItem = items.find(item => item.id_sach === book._id.toString());
      const quantity = orderItem?.so_luong || 1;
      return {
        _id: book._id,
        ten_sach: book.ten_sach,
        tac_gia: book.tac_gia,
        gia: book.gia,
        so_luong: quantity,
        shipping_cost: SHIPPING_COST,
        subtotal: book.gia * quantity,
        total_price: (book.gia * quantity) + (SHIPPING_COST)
      };
    });

    const totalAmount = booksWithShipping.reduce((sum, book) => sum + book.total_price, 0);
    const totalShipping = booksWithShipping.reduce((sum, book) => sum + book.shipping_cost, 0);

    return {
      books: booksWithShipping,
      total_amount: totalAmount,
      shipping_total: totalShipping
    };
  }
}

const paymentService = new PaymentService();
export default paymentService;
