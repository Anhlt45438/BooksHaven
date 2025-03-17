import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import databaseServices from '~/services/database.services';
import DanhGia from '~/models/schemas/DanhGia.schemas';

export const createRating = async (req: Request, res: Response) => {
  try {
    const userId = req.decoded?.user_id;
    const { id_sach, danh_gia, binh_luan } = req.body;

    // Check if user has already rated this book
    const existingRating = await databaseServices.ratings.findOne({
      id_user: new ObjectId(userId),
      id_sach: new ObjectId(id_sach)
    });

    if (existingRating) {
      return res.status(400).json({
        message: 'You have already rated this book'
      });
    }

    const rating = new DanhGia({
      id_danh_gia: new ObjectId(),
      id_user: new ObjectId(userId),
      id_sach: new ObjectId(id_sach),
      danh_gia,
      binh_luan,
      ngay_tao: new Date()
    });

    await databaseServices.ratings.insertOne(rating);

    return res.status(201).json({
      message: 'Rating created successfully',
      data: rating
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error creating rating'
    });
  }
};

export const updateRating = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.decoded?.user_id;
    const { danh_gia, binh_luan } = req.body;

    const result = await databaseServices.ratings.findOneAndUpdate(
      { 
        id_danh_gia: new ObjectId(id),
        id_user: new ObjectId(userId)
      },
      {
        $set: {
          danh_gia,
          binh_luan,
          ngay_tao: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({
        message: 'Rating not found or you are not authorized to update it'
      });
    }

    return res.status(200).json({
      message: 'Rating updated successfully',
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error updating rating'
    });
  }
};

export const deleteRating = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.decoded?.user_id;

    const result = await databaseServices.ratings.deleteOne({
      id_danh_gia: new ObjectId(id),
      id_user: new ObjectId(userId)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: 'Rating not found or you are not authorized to delete it'
      });
    }

    return res.status(200).json({
      message: 'Rating deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error deleting rating'
    });
  }
};

export const getBookRatings = async (req: Request, res: Response) => {
  try {
    const { id_sach } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const ratings = await databaseServices.ratings
      .aggregate([
        {
          $match: { id_sach: new ObjectId(id_sach) }
        },
        {
          $lookup: {
            from: process.env.DB_USERS_SACH_COLLECTION || 'users',
            localField: 'id_user',
            foreignField: '_id',
            as: 'user_info'
          }
        },
        {
          $unwind: '$user_info'
        },
        {
          $project: {
            id_danh_gia: 1,
            danh_gia: 1,
            binh_luan: 1,
            ngay_tao: 1,
            'user_info.username': 1,
            'user_info._id': 1
          }
        },
        { $skip: skip },
        { $limit: limit }
      ]).toArray();

    const total = await databaseServices.ratings.countDocuments({
      id_sach: new ObjectId(id_sach)
    });

    // Calculate average rating
    const avgRating = await databaseServices.ratings
      .aggregate([
        {
          $match: { id_sach: new ObjectId(id_sach) }
        },
        {
          $group: {
            _id: null,
            average: { $avg: '$danh_gia' }
          }
        }
      ]).toArray();

    return res.status(200).json({
      data: ratings,
      average_rating: avgRating[0]?.average || 0,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error getting ratings'
    });
  }
};