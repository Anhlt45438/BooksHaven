import { ObjectId } from 'mongodb';
import databaseServices from './database.services';
import Sach from '~/models/schemas/Sach.schemas';
import ChiTietTheLoai from '~/models/schemas/ChiTietTheLoai.schemas';
import CuaHang from '~/models/schemas/CuaHang.schemas';
import { TrangThaiDonHangStatus } from '~/constants/enum';
interface TotalBookSold {
  _id: ObjectId;
  total_sold: number;
}
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
      id_shop: new ObjectId(shop.id_shop),
      da_ban: 0
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
    filter.trang_thai = true;
    const [sach, total] = await Promise.all([
      databaseServices.books
        .find({...filter})
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
  async getHotBooks(limit: number = 5) {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const dataTotalBuy: TotalBookSold[] = await databaseServices.orders.aggregate<TotalBookSold>([
      {
        $match: {
          ngay_mua: { $gte: firstDayOfMonth },
          trang_thai: { $in: [
            TrangThaiDonHangStatus.cho_xac_nhan, 
            TrangThaiDonHangStatus.da_hoan_thanh_don,
            TrangThaiDonHangStatus.da_nhan_hang,
            TrangThaiDonHangStatus.dang_giao_hang,
            TrangThaiDonHangStatus.dang_chuan_bi,
          ] } // Only count completed orders
        }
      },
      {
        $lookup: {
          from: process.env.DB_ORDERS_CHI_TIET_DON_HANG_COLLECTION,
          localField: 'id_don_hang',
          foreignField: 'id_don_hang',
          as: 'details'
        }
      },
      { $unwind: '$details' },
      {
        $group: {
          _id: '$details.id_sach',
          total_sold: { $sum: '$details.so_luong' }
        }
      },
      { $sort: { total_sold: -1 } },
      { $limit: limit }
    ]).toArray();
  
    const booksWithDetails = await Promise.all(
      dataTotalBuy.map(async (item) => {
        const book = await databaseServices.books.findOne(
          { _id: item._id },
        );
        return book
      })
    );
    return booksWithDetails;
  }
  async  getBestSellingBooksThisMonth(shop_id: string, isShowAnh: boolean = false) {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const dataTotalBuy: TotalBookSold[] = await databaseServices.orders.aggregate<TotalBookSold>([
      {
        $match: {
          ngay_mua: { $gte: firstDayOfMonth },
          id_shop: new ObjectId(shop_id),
          trang_thai: { $in: [
            TrangThaiDonHangStatus.cho_xac_nhan, 
            TrangThaiDonHangStatus.da_hoan_thanh_don,
            TrangThaiDonHangStatus.da_nhan_hang,
            TrangThaiDonHangStatus.dang_giao_hang,
            TrangThaiDonHangStatus.dang_chuan_bi,
          ] } // Only count completed orders
        }
      },
      {
        $lookup: {
          from: process.env.DB_ORDERS_CHI_TIET_DON_HANG_COLLECTION,
          localField: 'id_don_hang',
          foreignField: 'id_don_hang',
          as: 'details'
        }
      },
      { $unwind: '$details' },
      {
        $group: {
          _id: '$details.id_sach',
          total_sold: { $sum: '$details.so_luong' }
        }
      },
      { $sort: { total_sold: -1 } },
      { $limit: 5 }
    ]).toArray();
  
    const booksWithDetails = await Promise.all(
      dataTotalBuy.map(async (item) => {
        const book = await databaseServices.books.findOne(
          { _id: item._id },
          { projection: { anh: isShowAnh ? 1: 0 } }
        );
        const {total_sold } = item;
        return {
          total_sold,
          book: book
        };
      })
    );
    return booksWithDetails;
  }
  async  getShopStatistics(shop_id: string) {
    const [
      bestSellingThisMonth,
      mostSoldAllTime,
      bestRated,
      worstRated
    ] = await Promise.all([
      this.getBestSellingBooksThisMonth(shop_id),
      getMostSoldBooks(shop_id),
      getBooksWithRating(shop_id, 5),
      getBooksWithRating(shop_id, 1)
    ]);
  
    return {
      best_selling_this_month: bestSellingThisMonth,
      most_sold_all_time: mostSoldAllTime,
      best_rated: bestRated,
      worst_rated: worstRated
    };
  }
  
}


async function getMostSoldBooks(shop_id: string) {
  return databaseServices.books
    .find(
      { id_shop: new ObjectId(shop_id) },
      { projection: { anh: 0 } }
    )
    .sort({ da_ban: -1 })
    .limit(5)
    .toArray();
}

async function getBooksWithRating(shop_id: string, rating: number, countGet: number = 5, isShowAnh: boolean = false) {
  // First get all ratings with the specified rating value
  const ratings = await databaseServices.ratings
    .find({ danh_gia: rating })
    .toArray();

  // Group ratings by book ID and count them
  const ratingCounts = ratings.reduce((acc, curr) => {
    const bookId = curr.id_sach.toString();
    acc[bookId] = (acc[bookId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get books from this shop
  const books = await databaseServices.books
    .find(
      { 
        id_shop: new ObjectId(shop_id),
        trang_thai: true,
        _id: { $in: ratings.map(r => r.id_sach) }
      },
      { projection: { anh:isShowAnh ? 1: 0 } }
    )
    .toArray();

  // Combine books with their rating counts and sort
  const booksWithRatings = books
    .map(book => ({
      ...book,
      rating_count: ratingCounts[book._id.toString()] || 0
    }))
    .sort((a, b) => b.rating_count - a.rating_count)
    .slice(0, countGet);

  return booksWithRatings;
}


export default new SachService();