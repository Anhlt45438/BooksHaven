import { ObjectId } from 'mongodb';
import databaseServices from './database.services';
import Sach from '~/models/schemas/Sach.schemas';
import ChiTietTheLoai from '~/models/schemas/ChiTietTheLoai.schemas';

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
    id_shop: string;
    the_loai: Array<{
      id_the_loai: string;
    }>;
  }) {
    const { the_loai, ...sachData } = payload;
    
    // Create new book
    const sach = new Sach({
      ...sachData,
      id_sach: new ObjectId(),
      id_shop: new ObjectId(payload.id_shop)
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
  async updateSach(id: string, payload: Partial<Sach>) {
    const result = await databaseServices.books.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...payload,
          id_shop: payload.id_shop ? new ObjectId(payload.id_shop) : undefined
        }
      },
      { returnDocument: 'after' }
    );
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
        .find(filter)
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
}

export default new SachService();