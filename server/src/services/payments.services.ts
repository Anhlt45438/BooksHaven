import { ObjectId } from 'mongodb';
import databaseServices from './database.services';

const SHIPPING_COST = 30000; // 30,000 VND shipping cost per book

class PaymentService {
  async calculateBooksTotal(items: { id_sach: string; so_luong: number }[]) {
    const objectIds = items.map(item => new ObjectId(item.id_sach));

    // Get books information with shop details
    const books = await databaseServices.books
      .find({ _id: { $in: objectIds } })
      .toArray();

    // Group books by shop
    const booksByShop = books.reduce((acc, book) => {
      const shopId = book.id_shop?.toString();
      if (!acc[shopId]) {
        acc[shopId] = [];
      }
      acc[shopId].push(book);
      return acc;
    }, {} as Record<string, typeof books>);

    // Calculate totals with one shipping cost per shop
    const booksWithShipping = books.map(book => {
      const orderItem = items.find(item => item.id_sach === book._id.toString());
      const quantity = orderItem?.so_luong || 1;
      return {
        _id: book._id,
        ten_sach: book.ten_sach,
        tac_gia: book.tac_gia,
        gia: book.gia,
        so_luong: quantity,
        id_shop: book.id_shop,
        subtotal: book.gia * quantity,
        total_price: book.gia * quantity
      };
    });

    // Add shipping cost once per shop
    const totalShipping = Object.keys(booksByShop).length * SHIPPING_COST;
    const totalAmount = booksWithShipping.reduce((sum, book) => sum + book.total_price, 0) + totalShipping;

    return {
      books: booksWithShipping,
      total_amount: totalAmount,
      shipping_total: totalShipping
    };
  }
}

const paymentService = new PaymentService();
export default paymentService;
