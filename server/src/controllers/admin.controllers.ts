import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import databaseServices from '~/services/database.services';
import { AccountStatus, AdminHistoryChangeBalanceStatus } from '~/constants/enum';
import sachServices from '~/services/sach.services';
import adminServices from '~/services/admin.services';


export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    // Bước 1: Lấy danh sách users
    const users = await databaseServices.users
      .find({}, { projection: { password: 0 } })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Bước 2: Map qua từng user để lấy vai trò
    const usersWithRoles = await Promise.all(
      users.map(async (user) => {
        const roles = await databaseServices.chiTietVaiTro
          .aggregate([
            {
              $match: { id_user: user._id }
            },
            {
              $lookup: {
                from: process.env.DB_ROLES_VAI_TRO_COLLECTION || 'vai_tro',
                localField: 'id_role',
                foreignField: 'id_role',
                as: 'role_info'
              }
            },
            {
              $unwind: '$role_info'
            },
            {
              $project: {
                _id: "$role_info.id_role",
                id_role: "$role_info.id_role",
                ten_role: "$role_info.ten_role"
              }
            }
          ]).toArray();

        return {
          ...user,
          vai_tro: roles
        };
      })
    );
    
    const total = await databaseServices.users.countDocuments();

    return res.status(200).json({
      data: usersWithRoles,
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
            from: process.env.DB_ROLES_CHI_TIET_VAI_TRO_COLLECTION,
            localField: '_id',
            foreignField: 'id_user',
            as: 'roles'
          }
        },
        {
          $lookup: {
            from:  process.env.DB_ROLES_VAI_TRO_COLLECTION,
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

export const updateBookStatus = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const { trang_thai } = req.body;

    const updatedBook = await databaseServices.books.findOneAndUpdate(
      { _id: new ObjectId(bookId) },
      { $set: { trang_thai } },
      { returnDocument: 'after' }
    );

    if (!updatedBook) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    return res.status(200).json({
      message: 'Book status updated successfully',
      data: updatedBook
    });
  } catch (error) {
    console.error('Update book status error:', error);
    return res.status(500).json({
      message: 'Error updating book status'
    });
  }
};


export const getInactiveBooks = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      databaseServices.books
        .find({ trang_thai: false })
        .skip(skip)
        .limit(limit)
        .toArray(),
      databaseServices.books.countDocuments({ trang_thai: false })
    ]);

    // Add categories for each book
    const booksWithCategories = await Promise.all(
      books.map(async (book) => {
        const categories = await sachServices.getBookCategories(book._id);
        return {
          ...book,
          the_loai: categories
        };
      })
    );

    return res.status(200).json({
      data: booksWithCategories,
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get inactive books error:', error);
    return res.status(500).json({
      message: 'Error getting inactive books'
    });
  }
};


export const getAdminWalletInfo = async (req: Request, res: Response) => {
  try {
    const walletInfo = await adminServices.getAdminInfoWallet();
    if (walletInfo) {
      walletInfo.tong_tien_shop = Number(walletInfo.tong_tien_shop);
      walletInfo.tien_thu_duoc = Number(walletInfo.tien_thu_duoc);
    }
    return res.status(200).json({
      message: 'Get admin wallet info successfully',
      data: walletInfo
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error getting admin wallet info',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getAdminWalletHistory = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as AdminHistoryChangeBalanceStatus;
    const result = await adminServices.getHistoryChangeBalance(page, limit, status);
    
    return res.status(200).json({
      message: 'Get admin wallet history successfully',
      data: result.history,
      pagination: result.pagination
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error getting admin wallet history',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
