import { ObjectId } from 'mongodb';
import databaseServices from './database.services';
import Sach from '~/models/schemas/Sach.schemas';
import ChiTietTheLoai from '~/models/schemas/ChiTietTheLoai.schemas';
import CuaHang from '~/models/schemas/CuaHang.schemas';

class SachService {
  async createSach(payload: {
    ten_sach: string;
    tac_gia: string;
    mo_ta: string;
    gia: number;
    so_luong: number;
    anh: string;
    trang_thai: boolean;
    so_trang: number;
    kich_thuoc: string;
    the_loai: Array<{
      id_the_loai: string;
    }>;
  }, userId: string) {
    const { the_loai, ...sachData } = payload;
    const shop:CuaHang | null = await databaseServices.shops.findOne({
      id_user: new ObjectId(userId)
    });
    if (!shop) {
      throw new Error('Shop not found');
    }
    // Create new book
    const sach = new Sach({
      ...sachData,
      id_sach: new ObjectId(),
      id_shop: new ObjectId(shop.id_shop)
    });
    
    // Insert book and create category associations
    const [bookResult] = await Promise.all([
      databaseServices.books.insertOne(sach),
      ...the_loai.map(category => 
        databaseServices.detailCategories.insertOne(
          new ChiTietTheLoai({
            id_cttl: new ObjectId(),
            id_sach: sach.id_sach!,
            id_the_loai: new ObjectId(category.id_the_loai)
          })
        )
      )
    ]);
    return bookResult;
  }
  async updateSach(id: string, payload: Partial<Sach> & { the_loai?: Array<{ id_the_loai: string }> }) {
      const { the_loai, ...sachData } = payload;
      
      // Update book basic info
      const result = await databaseServices.books.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: sachData },
        { returnDocument: 'after' }
      );
  
      // If categories are provided, update them
      if (the_loai && Array.isArray(the_loai)) {
        // Delete all existing categories for this book
        await databaseServices.detailCategories.deleteMany({
          id_sach: new ObjectId(id)
        });
  
        // Insert new categories
        await Promise.all(
          the_loai.map(category => 
            databaseServices.detailCategories.insertOne(
              new ChiTietTheLoai({
                id_cttl: new ObjectId(),
                id_sach: new ObjectId(id),
                id_the_loai: new ObjectId(category.id_the_loai)
              })
            )
          )
        );
      }
  
      return result;
    }

  async deleteSach(id: string) {
    const result = await databaseServices.books.deleteOne({
      _id: new ObjectId(id)
    });
    return result;
  }

  async getSachById(id: string) {
    const sach = await databaseServices.books.findOne({
      _id: new ObjectId(id)
    });
    return sach;
  }

  async getAllSach(query: {
    page?: number;
    limit?: number;
    shop_id?: string;
  } = {}) {
    const { page = 1, limit = 20, shop_id } = query;
    const skip = (page - 1) * limit;
    
    const filter: any = {};
    if (shop_id) {
      filter.id_shop = new ObjectId(shop_id);
    }

    const [sach, total] = await Promise.all([
      databaseServices.books
        .find({...filter, trang_thai: true})
        .skip(skip)
        .limit(limit)
        .toArray(),
      databaseServices.books.countDocuments(filter)
    ]);

    return {
      sach,
      pagination: {
        page,
        limit,
        total
      }
    };
  }

  async searchSach(keyword: string) {
    const result = await databaseServices.books
      .find({
        $or: [
          { ten_sach: { $regex: keyword, $options: 'i' } },
          { tac_gia: { $regex: keyword, $options: 'i' } }
        ]
      })
      .toArray();
    return result;
  }

  async getBookCategories(bookId: ObjectId) {
    const categories = await databaseServices.detailCategories
      .aggregate([
        {
          $match: {
            id_sach: bookId
          }
        },
        {
          $lookup: {
            from: process.env.DB_CATEGORIES_COLLECTION || '',
            localField: 'id_the_loai',
            foreignField: '_id',
            as: 'category_info'
          }
        },
        {
          $unwind: '$category_info'
        },
        {
          $project: {
            id_the_loai: '$category_info._id',
            ten_the_loai: '$category_info.ten_the_loai'
          }
        }
      ]).toArray();
  
    return categories as { id_the_loai: ObjectId; ten_the_loai: string; }[];
  }
}

export default new SachService();