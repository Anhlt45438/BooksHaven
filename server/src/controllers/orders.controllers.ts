import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import databaseServices from '~/services/database.services';
import DonHang from '~/models/schemas/DonHang.schemas';
import ChiTietDonHang from '~/models/schemas/ChiTietDonHang.schemas';
import { TrangThaiDonHangStatus } from '~/constants/enum';
import paymentService from '~/services/payments.services';
import Sach from '~/models/schemas/Sach.schemas';
import ordersService from '~/services/orders.services';

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

    const results = await ordersService.createOrders(userId!, items);

    return res.status(201).json({
      message: 'Create orders successfully',
      data: results
    });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Error creating orders'
    });
  }
};