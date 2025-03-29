import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import databaseServices from '~/services/database.services';
import { TrangThaiDonHangStatus } from '~/constants/enum';
import ordersService from '~/services/orders.services';

// Get orders with pagination
export const getOrdersByUser = async (req: Request, res: Response) => {
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
// Get orders with pagination
export const getOrdersByShop = async (req: Request, res: Response) => {
  try {
    const userId = req.decoded?.user_id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const shop = await databaseServices.shops.findOne({ id_user: new ObjectId(userId) });
    const [orders, total] = await Promise.all([
      databaseServices.orders
        .find({ id_shop: shop!.id_shop })
        .sort({ ngay_mua: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      databaseServices.orders.countDocuments({ id_user: shop!.id_shop  })
    ]);

    // Get order details for each order
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        // Get all order details and books in parallel
        const [details, books] = await Promise.all([
          databaseServices.orderDetails
            .find({ id_don_hang: order.id_don_hang })
            .toArray(),
          (async () => {
            // First get order details
            const orderDetails = await databaseServices.orderDetails
              .find({ id_don_hang: order.id_don_hang })
              .toArray();
            
            // Extract book IDs from order details
            const bookIds = orderDetails.map(detail => new ObjectId(detail.id_sach));
            
            // Then fetch books
            return databaseServices.books
              .find({ _id: { $in: bookIds } })
              .toArray();
          })()
        ]);

        // Combine details with books without additional queries
        const chi_tiet_don_hang = details.map(detail => ({
          details: detail,
          book: books.find(book => book._id.toString() === detail.id_sach.toString())
        }));

        return { 
          ...order, 
          chi_tiet_don_hang 
        };
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

export const getOrdersByPaymentStatusForShop = async (req: Request, res: Response) => {
  try {
    const userId = req.decoded?.user_id;
    const isPaid = req.query.is_paid === 'true';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await ordersService.getOrdersByPaymentStatusForShop(userId!, isPaid, page, limit);

      // Get order details for each order
      const ordersWithDetails = await Promise.all(
        result.orders.map(async (order) => {
          const details = await databaseServices.orderDetails
            .find({ id_don_hang: order.id_don_hang })
            .toArray();
          let detailsWithBook: any[] = [];
          // details.forEach(async(item) => {
          //   (details as any).sach = await databaseServices.books.findOne({ id_sach: item.id_sach });
          //   detailsWithBook.push({details: item, book: (details as any).sach})
          // })
           await Promise.all(details.map(async(item) =>
               databaseServices.books.findOne({ id_sach: item.id_sach }).then ((book) =>
                detailsWithBook.push({don_hang: item, sach: book})
             )
          ));
          return { ...order, 
            chi_tiet_don_hang: detailsWithBook,
            
           };
        })
      );
    return res.status(200).json({
      message: 'Get orders successfully',
      data: ordersWithDetails
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return res.status(500).json({
      message: 'Error getting orders'
    });
  }
};