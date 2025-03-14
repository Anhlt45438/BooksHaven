import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import databaseServices from '~/services/database.services';
import { AccountStatus } from '~/constants/enum';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await databaseServices.users
      .aggregate([
        {
          $lookup: {
            from: 'chi_tiet_vai_tro',
            localField: '_id',
            foreignField: 'id_user',
            as: 'roles'
          }
        },
        {
          $lookup: {
            from: 'vai_tro',
            localField: 'roles.id_role',
            foreignField: '_id',
            as: 'role_details'
          }
        }
      ])
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await databaseServices.users.countDocuments();

    const usersWithoutPassword = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return res.status(200).json({
      data: usersWithoutPassword,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error getting users list'
    });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!Object.values(AccountStatus).includes(status)) {
      return res.status(400).json({
        message: 'Invalid status value'
      });
    }

    const  result = await databaseServices.users.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { trang_thai: status } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    

    return res.status(200).json({
      message: 'User status updated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error updating user status'
    });
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await databaseServices.users
      .aggregate([
        {
          $match: { _id: new ObjectId(userId) }
        },
        {
          $lookup: {
            from: 'chi_tiet_vai_tro',
            localField: '_id',
            foreignField: 'id_user',
            as: 'roles'
          }
        },
        {
          $lookup: {
            from: 'vai_tro',
            localField: 'roles.id_role',
            foreignField: '_id',
            as: 'role_details'
          }
        }
      ]).toArray();

    if (!user[0]) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const { password, ...userWithoutPassword } = user[0];

    return res.status(200).json({
      data: userWithoutPassword
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error getting user details'
    });
  }
};