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
    let statusOrder = req.query.status_order as string || '';

    const skip = (page - 1) * limit;
    const query: any = { id_user: new ObjectId(userId) };

    if (statusOrder) {
    
      query.trang_thai = { $regex: new RegExp(statusOrder, 'i') };
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
    let statusOrder = req.query.status_order as string || '';
    
    const skip = (page - 1) * limit;
    const shop = await databaseServices.shops.findOne({ id_user: new ObjectId(userId) });
    
    // Build query object
    const query: any = { id_shop: shop!.id_shop };
    
    // Only add status filter if statusOrder is provided
    if (statusOrder) {
    
      query.trang_thai = { $regex: new RegExp(statusOrder, 'i') };
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
          chi_tiet_don_hang,
          user_info: await databaseServices.users.findOne({ id_user: order.id_user },{projection: { mat_khau: 0, 
            refresh_token: 0,
            email_verify_token: 0,
            forgot_password_token: 0 }})
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
    
    // Parse date range from query params
    const startDate = req.query.start_date ? new Date(req.query.start_date as string) : undefined;
    const endDate = req.query.end_date ? new Date(req.query.end_date as string) : undefined;

    const result = await ordersService.getOrdersByPaymentStatusForShop(
      userId!, 
      isPaid, 
      page, 
      limit,
      startDate,
      endDate
    );

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

export const getRecentOrderByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.decoded?.user_id;

    // Get the most recent payment for the user
    const recentPayment = await databaseServices.payments
      .findOne(
        { id_user: new ObjectId(userId) },
        { sort: { ngay_thanh_toan: -1 } }
      );

    if (!recentPayment) {
      return res.status(404).json({
        message: 'No recent orders found'
      });
    }

    // Get all orders associated with this payment
    const orders = await databaseServices.orders
      .find({ 
        id_don_hang: { 
          $in: recentPayment.id_don_hangs.map(id => new ObjectId(id)) 
        } 
      })
      .toArray();

    if (!orders.length) {
      return res.status(404).json({
        message: 'Orders not found'
      });
    }

    // Get order details and books for all orders
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const [details, books] = await Promise.all([
          databaseServices.orderDetails
            .find({ id_don_hang: order.id_don_hang })
            .toArray(),
          databaseServices.books
            .find({ 
              _id: { 
                $in: (await databaseServices.orderDetails
                  .find({ id_don_hang: order.id_don_hang })
                  .toArray())
                  .map(detail => new ObjectId(detail.id_sach)) 
              }
            })
            .toArray()
        ]);

        // Combine details with books
        const orderDetails = details.map(detail => ({
          details: detail,
          book: books.find(book => book._id.toString() === detail.id_sach.toString())
        }));

        return {
          ...order,
          chi_tiet_don_hang: orderDetails
        };
      })
    );

    return res.status(200).json({
      message: 'Get recent orders successfully',
      data: {
        orders: ordersWithDetails,
        payment_info: recentPayment
      }
    });

  } catch (error) {
    console.error('Get recent order error:', error);
    return res.status(500).json({
      message: 'Error getting recent orders'
    });
  }
};
