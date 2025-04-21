import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { FeedbackStatus, RolesType } from '~/constants/enum';
import Feedback from '~/models/schemas/Feedback.schemas';
import databaseServices from '~/services/database.services';

// Create new feedback
export const createFeedback = async (req: Request, res: Response) => {
  try {
    const userId = req.decoded?.user_id;
    const { title, content } = req.body;

    const feedback = new Feedback({
      id_user: new ObjectId(userId),
      tieu_de: title,
      noi_dung: content,
      ngay_tao: new Date(),
      trang_thai: FeedbackStatus.Pending,
      phan_hoi: [
        {
          id_message: new ObjectId(),
          sender_id: new ObjectId(userId),
          content,
          created_at: new Date(),
          is_admin: false
        }
      ]
    });
    await databaseServices.feedbacks.insertOne(feedback);

    return res.status(201).json({
      message: 'Feedback created successfully',
      data: feedback
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error creating feedback'
    });
  }
};

// Get feedbacks for user
export const getUserFeedbacks = async (req: Request, res: Response) => {
  try {
    const userId = req.decoded?.user_id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [feedbacks, total] = await Promise.all([
      databaseServices.feedbacks
        .find({ id_user: new ObjectId(userId) })
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      databaseServices.feedbacks.countDocuments({ id_user: new ObjectId(userId) })
    ]);

    return res.status(200).json({
      message: 'Get feedbacks successfully',
      data: feedbacks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error getting feedbacks'
    });
  }
};

// Get all feedbacks for admin
export const getAllFeedbacks = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status as string;

    const query = status ? { 
      trang_thai: status as FeedbackStatus
     } : {};
    const [feedbacks, total] = await Promise.all([
      databaseServices.feedbacks
        .find(query)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      databaseServices.feedbacks.countDocuments(query)
    ]);

    // Get user info for each feedback
    const feedbacksWithUserInfo = await Promise.all(
      feedbacks.map(async (feedback) => {
        const user = await databaseServices.users.findOne(
          { _id: feedback.id_user },
          { projection: { username: 1, email: 1, avatar: 1 } }
        );
        return { ...feedback, user_info: user };
      })
    );

    return res.status(200).json({
      message: 'Get feedbacks successfully',
      data: feedbacksWithUserInfo,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error getting feedbacks'
    });
  }
};

// Reply to feedback (both admin and user)
export const replyToFeedback = async (req: Request, res: Response) => {
  try {
    const { feedbackId } = req.params;
    const userId = req.decoded?.user_id;
    const { content } = req.body;
    const isAdmin = ((req as any).userRoles as RolesType[]).includes( RolesType.Admin);
    const newMessage = {
      id_message: new ObjectId(),
      sender_id: new ObjectId(userId),
      content,
      created_at: new Date(),
      is_admin: isAdmin
    };

    const result = await databaseServices.feedbacks.findOneAndUpdate(
      { _id: new ObjectId(feedbackId) },
      { 
        $push: { phan_hoi: newMessage },
        ...(isAdmin && { $set: { trang_thai: FeedbackStatus.InProgress } })
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({
        message: 'Feedback not found'
      });
    }

    return res.status(200).json({
      message: 'Reply added successfully',
      data: result.value
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error replying to feedback'
    });
  }
};

// Update feedback status (admin only)
export const updateFeedbackStatus = async (req: Request, res: Response) => {
  try {
    const { feedbackId } = req.params;
    const { status } = req.body;

    if (![FeedbackStatus.Pending, FeedbackStatus.InProgress, FeedbackStatus.Resolved].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status'
      });
    }
    const result = await databaseServices.feedbacks.findOneAndUpdate(
      { _id: new ObjectId(feedbackId) },
      { $set: { trang_thai: status } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({
        message: 'Feedback not found'
      });
    }

    return res.status(200).json({
      message: 'Status updated successfully',
      data: result.value
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error updating feedback status'
    });
  }
};

export const searchFeedbacks = async (req: Request, res: Response) => {
  try {
    const { q, status, page = 1, limit = 10 } = req.query;
    
    // Build search query
    const query: any = {};
    
    if (q) {
      query.tieu_de = { $regex: (q as string).trim(), $options: 'i' };
    }
    
    if (status) {
      query.trang_thai
      = status
    }

    const skip = (Number(page) - 1) * Number(limit);

    const feedbacks = await databaseServices.feedbacks
      .find(query)
      .skip(skip)
      .limit(Number(limit))
      .toArray();

    const total = await databaseServices.feedbacks.countDocuments(query);

    return res.json({
      message: 'Search feedbacks successfully',
      data: feedbacks,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Search feedbacks error:', error);
    return res.status(500).json({
      message: 'Error searching feedbacks',
      error: 'Internal server error'
    });
  }
};