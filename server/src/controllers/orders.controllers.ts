import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import databaseServices from '~/services/database.services';
import DonHang from '~/models/schemas/DonHang.schemas';
import ChiTietDonHang from '~/models/schemas/ChiTietDonHang.schemas';
import { TrangThaiDonHangStatus } from '~/constants/enum';
import paymentService from '~/services/payments.services';
import Sach from '~/models/schemas/Sach.schemas';

// Get orders with pagination
export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.decoded?.user_id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      databaseServices.orders
        .find({ id_user: new ObjectId(userId) })
        .sort({ ngay_mua: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      databaseServices.orders.countDocuments({ id_user: new ObjectId(userId) })
    ]);

    // Get order details for each order
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const details = await databaseServices.orderDetails
          .find({ id_don_hang: order.id_don_hang })
          .toArray();
        return { ...order, details };
      })
    );

    return res.status(200).json({
      message: 'Get orders successfully',
      data: ordersWithDetails,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error getting orders'
    });
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { trang_thai } = req.body;

    if (!Object.values(TrangThaiDonHangStatus).includes(trang_thai)) {
      return res.status(400).json({
        message: 'Invalid order status'
      });
    }

    const result = await databaseServices.orders.findOneAndUpdate(
      { id_don_hang: new ObjectId(orderId) },
      { $set: { trang_thai } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    return res.status(200).json({
      message: 'Update order status successfully',
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error updating order status'
    });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.decoded?.user_id;
    const { items } = req.body;
    var books: Array<Sach> = [];
    //  clone list items to new array item
    var itemsClone = JSON.parse(JSON.stringify(items));
    for (const item of itemsClone) {
      const book = await databaseServices.books.findOne({ 
        _id: new ObjectId(item.id_sach) 
      });
      
      if (!book) {
        return res.status(404).json({
          message: `Book with ID ${item.id_sach} not found`
        });
      }
      
      if (book.so_luong < item.so_luong) {
        return res.status(400).json({
          message: `Book "${book.ten_sach}" is out of stock. Available: ${book.so_luong}`
        });
      } else {
        item.so_luong+=book.so_luong;
      }
      books.push(book);
    }

    // Process orders after validation
    const orderPromises = items.map(async (item: any) => {
      const bookTotal = await paymentService.calculateBooksTotal([
        { id_sach: item.id_sach, so_luong: item.so_luong }
      ]);
      const book = books.find((b) => b.id_sach?.toString() === item.id_sach);
       await databaseServices.books.findOneAndUpdate(
        { _id: new ObjectId(item.id_sach) },
        { $inc: { so_luong: -item.so_luong } },
        { returnDocument: 'after' }
      );

      const order = new DonHang({
        id_don_hang: new ObjectId(),
        id_user: new ObjectId(userId),
        id_shop: new ObjectId(book?.id_shop),
        ngay_mua: new Date(),
        tong_tien: bookTotal.total_amount,
        trang_thai: TrangThaiDonHangStatus.cho_xac_nhan
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

    const results = await Promise.all(orderPromises);

    return res.status(201).json({
      message: 'Create orders successfully',
      data: results
    });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({
      message: 'Error creating orders'
    });
  }
};