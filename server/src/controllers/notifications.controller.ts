import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import databaseServices from '~/services/database.services';
import ThongBao from '~/models/schemas/ThongBao.schemas';

export const sendNotificationToUser = async (req: Request, res: Response) => {
  try {
    const { id_user, noi_dung_thong_bao } = req.body;

    const notification = new ThongBao({
      id_thong_bao: new ObjectId(),
      id_user: new ObjectId(id_user),
      noi_dung_thong_bao,
      ngay_tao: new Date(),
      da_doc: false
    });

    await databaseServices.notifications.insertOne(notification);

    return res.status(201).json({
      message: 'Notification sent successfully',
      data: notification
    });
  } catch (error) {
    console.error('Send notification error:', error);
    return res.status(500).json({
      message: 'Error sending notification'
    });
  }
};

export const sendNotificationByRole = async (req: Request, res: Response) => {
  try {
    const { role, noi_dung_thong_bao } = req.body;

    // Get role ID
    const roleData = await databaseServices.VaiTro.findOne({
      ten_role: role
    });

    if (!roleData) {
      return res.status(404).json({
        message: 'Role not found'
      });
    }

    // Get all users with this role
    const userRoles = await databaseServices.chiTietVaiTro
      .find({ id_role: roleData.id_role })
      .toArray();

    // Create notifications for all users
    const notifications = userRoles.map(userRole => new ThongBao({
      id_thong_bao: new ObjectId(),
      id_user: userRole.id_user,
      noi_dung_thong_bao,
      ngay_tao: new Date(),
      da_doc: false
    }));

    if (notifications.length > 0) {
      await databaseServices.notifications.insertMany(notifications);
    }

    return res.status(201).json({
      message: `Notifications sent to ${notifications.length} users`,
      data: {
        total_notifications: notifications.length
      }
    });
  } catch (error) {
    console.error('Send notifications by role error:', error);
    return res.status(500).json({
      message: 'Error sending notifications'
    });
  }
};

export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.decoded?.user_id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [notifications, total] = await Promise.all([
      databaseServices.notifications
        .find({ id_user: new ObjectId(userId) })
        .sort({ ngay_tao: -1 })
        .skip(skip)
        .limit(Number(limit))
        .toArray(),
      databaseServices.notifications.countDocuments({ id_user: new ObjectId(userId) })
    ]);

    return res.status(200).json({
      data: notifications,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        total_pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get user notifications error:', error);
    return res.status(500).json({
      message: 'Error getting notifications'
    });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const { notification_id } = req.params;
    const userId = req.decoded?.user_id;

    const result = await databaseServices.notifications.findOneAndUpdate(
      {
        id_thong_bao: new ObjectId(notification_id),
        id_user: new ObjectId(userId)
      },
      {
        $set: { da_doc: true }
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({
        message: 'Notification not found'
      });
    }

    return res.status(200).json({
      message: 'Notification marked as read',
      data: result
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return res.status(500).json({
      message: 'Error updating notification'
    });
  }
};