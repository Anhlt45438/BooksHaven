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

    // First get all ratings
    const ratings = await databaseServices.ratings
      .find({ 
        id_sach: new ObjectId(id_sach) 
      })
      .sort({ ngay_tao: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Then fetch user info for each rating
    const ratingsWithUserInfo = await Promise.all(
      ratings.map(async (rating) => {
        const user = await databaseServices.users.findOne(
          { _id: rating.id_user },
          { projection: { username: 1, email: 1, name: 1 } }
        );

        return {
          id_danh_gia: rating.id_danh_gia,
          danh_gia: rating.danh_gia,
          binh_luan: rating.binh_luan,
          ngay_tao: rating.ngay_tao,
          user: user ? {
            _id: user._id,
            username: user.username,
            email: user.email,
            name: user.username,
            avatar: user.avatar
          } : null
        };
      })
    );

    // Get total count and average in one query
    const stats = await databaseServices.ratings
      .aggregate([
        {
          $match: { 
            id_sach: new ObjectId(id_sach) 
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            average: { $avg: '$danh_gia' }
          }
        }
      ]).toArray();

    const total = stats[0]?.total || 0;
    const averageRating = stats[0]?.average || 0;

    return res.status(200).json({
      data: ratings,
      average_rating: Number(averageRating.toFixed(1)),
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