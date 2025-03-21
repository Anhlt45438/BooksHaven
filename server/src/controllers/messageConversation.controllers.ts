import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import databaseServices from '~/services/database.services';
import HoiThoai from '~/models/schemas/ConversationMessage.schemas';
import { ChiTietTinNhan } from '~/models/schemas/DetailMessage.schemas';

// Create new conversation
export const createConversation = async (req: Request, res: Response) => {
  try {
    const userId = req.decoded?.user_id;
    const { id_user_2 } = req.body;

    if (!id_user_2) {
      return res.status(400).json({
        message: 'Recipient user ID is required'
      });
    }

    // Check if conversation already exists
    const existingConversation = await databaseServices.conversations.findOne({
      $or: [
        { id_user_1: new ObjectId(userId), id_user_2: new ObjectId(id_user_2) },
        { id_user_1: new ObjectId(id_user_2), id_user_2: new ObjectId(userId) }
      ]
    });

    if (existingConversation) {
      return res.status(400).json({
        message: 'Conversation already exists',
        data: existingConversation
      });
    }

    const conversation = new HoiThoai({
      id_hoi_thoai: new ObjectId(),
      id_user_1: new ObjectId(userId),
      id_user_2: new ObjectId(id_user_2),
      ngay_cap_nhat: new Date(),
      // trang_thai: true
    });

    await databaseServices.conversations.insertOne(conversation);

    return res.status(201).json({
      message: 'Conversation created successfully',
      data: conversation
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    return res.status(500).json({
      message: 'Error creating conversation'
    });
  }
};

// Get user's conversations
export const getUserConversations = async (req: Request, res: Response) => {
  try {
    const userId = req.decoded?.user_id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [conversations, total] = await Promise.all([
      databaseServices.conversations
        .find({ 
          $or: [
            { id_user_1: new ObjectId(userId) },
            { id_user_2: new ObjectId(userId) }
          ]
        })
        .sort({ ngay_cap_nhat: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      databaseServices.conversations.countDocuments({
        $or: [
          { id_user_1: new ObjectId(userId) },
          { id_user_2: new ObjectId(userId) }
        ]
      })
    ]);

    return res.status(200).json({
      data: conversations,
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    return res.status(500).json({
      message: 'Error getting conversations'
    });
  }
};

// Send message
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const userId = req.decoded?.user_id;
    const { id_hoi_thoai, noi_dung, duong_dan_file } = req.body;

    // Verify user has access to this conversation
    const conversation = await databaseServices.conversations.findOne({
      id_hoi_thoai: new ObjectId(id_hoi_thoai),
      $or: [
        { id_user_1: new ObjectId(userId) },
        { id_user_2: new ObjectId(userId) }
      ],
      // ngay_cap_nhat: new Date(),
      
    });

    if (!conversation) {
      return res.status(403).json({
        message: 'Access denied to this conversation'
      });
    }
    await databaseServices.conversations.updateOne(
      { id_hoi_thoai: new ObjectId(id_hoi_thoai) },
      { $set: { ngay_cap_nhat: new Date() } }
    );

    const message = new ChiTietTinNhan({
      id_chi_tiet_tin_nhan: new ObjectId(),
      id_hoi_thoai: new ObjectId(id_hoi_thoai),
      id_user_gui: new ObjectId(userId),
      noi_dung,
      duong_dan_file,
      ngay_tao: new Date(),
      da_doc: false,
    });

    await Promise.all([
      databaseServices.detailMessages.insertOne(message),
      databaseServices.conversations.updateOne(
        { id_hoi_thoai: new ObjectId(id_hoi_thoai) },
        { 
          $set: { 
            ngay_cap_nhat: new Date(),
            tin_nhan_cuoi: noi_dung
          } 
        }
      )
    ]);

    return res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({
      message: 'Error sending message'
    });
  }
};

// Get messages in conversation
export const getConversationMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.decoded?.user_id;
    const { conversationId } = req.params;

    // Verify user has access to this conversation
    const conversation = await databaseServices.conversations.findOne({
      id_hoi_thoai: new ObjectId(conversationId),
      $or: [
        { id_user_1: new ObjectId(userId) },
        { id_user_2: new ObjectId(userId) }
      ],
      // trang_thai: true
    });

    if (!conversation) {
      return res.status(403).json({
        message: 'Access denied to this conversation'
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      databaseServices.detailMessages
        .find({ 
          id_hoi_thoai: new ObjectId(conversationId),
        })
        .sort({ ngay_tao: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      databaseServices.detailMessages.countDocuments({ 
        id_hoi_thoai: new ObjectId(conversationId),
      })
    ]);

    // Mark messages as read if recipient is current user
    if (messages.length > 0) {
      await databaseServices.detailMessages.updateMany(
        {
          id_hoi_thoai: new ObjectId(conversationId),
          id_user_gui: { $ne: new ObjectId(userId) },
          da_doc: false
        },
        { $set: { da_doc: true } }
      );
    }

    return res.status(200).json({
      data: messages,
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return res.status(500).json({
      message: 'Error getting messages'
    });
  }
};

export const markMessageAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.decoded?.user_id;
    const { messageId } = req.params;

    // Find message and verify user's access
    const message = await databaseServices.detailMessages.findOne({
      id_chi_tiet_tin_nhan: new ObjectId(messageId)
    });

    if (!message) {
      return res.status(404).json({
        message: 'Message not found'
      });
    }

    // Verify user has access to the conversation
    const conversation = await databaseServices.conversations.findOne({
      id_hoi_thoai: message.id_hoi_thoai,
      $or: [
        { id_user_1: new ObjectId(userId) },
        { id_user_2: new ObjectId(userId) }
      ],
      // trang_thai: true
    });

    if (!conversation) {
      return res.status(403).json({
        message: 'Access denied to this conversation'
      });
    }

    // Only mark as read if user is the recipient
    if (message.id_user_gui.toString() === userId) {
      return res.status(400).json({
        message: 'Cannot mark your own message as read'
      });
    }

    const result = await databaseServices.detailMessages.findOneAndUpdate(
      { id_chi_tiet_tin_nhan: new ObjectId(messageId) },
      { $set: { da_doc: true } },
      { returnDocument: 'after' }
    );

    return res.status(200).json({
      message: 'Message marked as read',
      data: result
    });
  } catch (error) {
    console.error('Mark message as read error:', error);
    return res.status(500).json({
      message: 'Error marking message as read'
    });
  }
};
