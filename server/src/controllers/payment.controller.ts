import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import databaseServices from '~/services/database.services';

const SHIPPING_COST = 30000; // 30,000 VND shipping cost per book

export const calculateOrderTotal = async (req: Request, res: Response) => {
  try {
    const { items } = req.body; // Expect array of { id_sach, so_luong }

    if (!Array.isArray(items)) {
      return res.status(400).json({
        message: 'items must be an array of { id_sach, so_luong }'
      });
    }

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

    return res.status(200).json({
      data: {
        books: booksWithShipping,
        total_amount: totalAmount,
        shipping_total: totalShipping
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Error getting payment information'
    });
  }
};
