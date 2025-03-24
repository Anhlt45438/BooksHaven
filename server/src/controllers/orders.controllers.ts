import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import databaseServices from '~/services/database.services';
import DonHang from '~/models/schemas/DonHang.schemas';
import ChiTietDonHang from '~/models/schemas/ChiTietDonHang.schemas';
import { TrangThaiDonHangStatus } from '~/constants/enum';
import paymentService from '~/services/payments.services';

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

// Create new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.decoded?.user_id;
    const { id_shop, items } = req.body; // items: Array of { id_sach, so_luong }

    // Create separate orders for each book
    const orderPromises = items.map(async (item: any) => {
      // Calculate total for single book using payment service
      const bookTotal = await paymentService.calculateBooksTotal([
        { id_sach: item.id_sach, so_luong: item.so_luong }
      ]);

      // Create order for single book
      const order = new DonHang({
        id_don_hang: new ObjectId(),
        id_user: new ObjectId(userId),
        id_shop: new ObjectId(id_shop),
        ngay_mua: new Date(),
        tong_tien: bookTotal.total_amount,
        trang_thai: TrangThaiDonHangStatus.cho_xac_nhan
      });

      // Create order detail for the book
      const orderDetail = new ChiTietDonHang({
        id_ctdh: new ObjectId(),
        id_don_hang: order.id_don_hang as ObjectId,
        id_sach: new ObjectId(item.id_sach),
        so_luong: item.so_luong,

      });

      // Insert order and order detail
      await Promise.all([
        databaseServices.orders.insertOne(order),
        databaseServices.orderDetails.insertOne(orderDetail)
      ]);

      return {
        order,
        detail: orderDetail
      };
    });

    // Wait for all orders to be created
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