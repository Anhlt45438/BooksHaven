import { Request, Response } from 'express';
import sachService from '~/services/sach.services';
import databaseServices from '~/services/database.services';
import { ObjectId } from 'mongodb';
import { SachWithCategories } from '~/models/schemas/Sach.schemas';

export const createBook = async (req: Request, res: Response) => {
  try {
    const user_id = req.decoded?.user_id;
    
    const result = await sachService.createSach(req.body, user_id as string);
    return res.status(201).json({
      message: 'Create book successfully',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error creating book',
      error
    });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await sachService.updateSach(id, req.body);
    
    if (!result) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    return res.status(200).json({
      message: 'Update book successfully',
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error updating book',
      error
    });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    
    const activeOrders = await databaseServices.orderDetails.findOne({
      id_sach: new ObjectId(id),
    });

    
    if (activeOrders) {
      return res.status(400).json({
        message: 'Đã có đơn hàng từ sách này. Không thể xóa.!',
      });
    }
    await databaseServices.cartDetail.deleteMany({
      id_sach: new ObjectId(id)
    });
    // Delete book categories first
    await databaseServices.detailCategories.deleteMany({
      id_sach: new ObjectId(id)
    });
    
    // Delete book ratings
    await databaseServices.ratings.deleteMany({
      id_sach: new ObjectId(id)
    });

    // Then delete the book
    const result = await sachService.deleteSach(id);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    return res.status(200).json({
      message: 'Delete book successfully'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error deleting book',
      error
    });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await sachService.getSachById(id);

    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    // Get categories for the book
    const categories = await sachService.getBookCategories(new ObjectId(id));

    const bookWithCategories: SachWithCategories = {
      ...book,
      the_loai: categories as { id_the_loai: ObjectId; ten_the_loai: string; }[]
    };

    return res.status(200).json({
      data: bookWithCategories
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error getting book',
      error
    });
  }
};

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const { page, limit, shop_id, category_ids } = req.query;
    const result = await sachService.getAllSach({
      page: Number(page),
      limit: Number(limit),
      shop_id: shop_id as string,
      category_ids: Array.isArray(category_ids) 
      ? category_ids as string[]
      : category_ids 
      ? [category_ids as string] 
      : undefined
    });

    // Get categories for all books
    const booksWithCategories = await Promise.all(
      result.sach.map(async (book) => {
        const categories = await sachService.getBookCategories(book._id);
        return {
          ...book,
          the_loai: categories
        } as SachWithCategories;
      })
    );

    return res.status(200).json({
      data: booksWithCategories,
      pagination: result.pagination
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Error getting books',
      error
    });
  }
};

export const searchBooks = async (req: Request, res: Response) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({
        message: 'Keyword is required'
      });
    }

    const result = await sachService.searchSach(keyword as string);
    return res.status(200).json({
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error searching books',
      error
    });
  }
};


export const searchShopBooks = async (req: Request, res: Response) => {
  try {
    const { keyword, shop_id } = req.query;
    
    if (!keyword || !shop_id) {
      return res.status(400).json({
        message: 'Keyword and shop_id are required'
      });
    }

    const books = await databaseServices.books
      .aggregate([
        {
          $match: {
            $and: [
              { id_shop: new ObjectId(shop_id as string) },
              {
                $or: [
                  { ten_sach: { $regex: keyword as string, $options: 'i' } },
                  { tac_gia: { $regex: keyword as string, $options: 'i' } },
                  { mo_ta: { $regex: keyword as string, $options: 'i' } }
                ]
              }
            ]
          }
        },

      ]).toArray();

    return res.status(200).json({
      data: books
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error searching shop books',
      error
    });
  }
};

export const getStatisticsShop = async (req: Request, res: Response) => {
  try {
    const { shop_id } = req.query;
    
    if (!shop_id) {
      return res.status(400).json({
        message: 'Shop ID is required'
      });
    }

    const statistics = await sachService.getShopStatistics(shop_id as string);

    return res.status(200).json({
      data: statistics
    });
  } catch (error) {
    console.error('Get shop statistics error:', error);
    return res.status(500).json({
      message: 'Error getting shop statistics'
    });
  }
};


export const getHotBooks = async (req: Request, res: Response) => {
  try {
    const { limit, show_image } = req.query;
    
    const hotBooks = await sachService.getHotBooks(
      Number(limit) || 5,
    );

    // Get categories for hot books
    const booksWithCategories = await Promise.all(
      hotBooks.map(async (book) => {
        const categories = await sachService.getBookCategories(book!._id);
        return {
          ...book,
          the_loai: categories
        } as SachWithCategories;
      })
    );

    return res.status(200).json({
      data: booksWithCategories
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error getting hot books',
      error
    });
  }
};