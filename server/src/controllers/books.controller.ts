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

    // Delete book categories first
    await databaseServices.detailCategories.deleteMany({
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
    const categories = await databaseServices.detailCategories
      .aggregate([
        {
          $match: {
            id_sach: new ObjectId(id)
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
    const { page, limit, shop_id } = req.query;
    const result = await sachService.getAllSach({
      page: Number(page),
      limit: Number(limit),
      shop_id: shop_id as string
    });

    // Get categories for all books
    const booksWithCategories = await Promise.all(
      result.sach.map(async (book) => {
        const categories = await databaseServices.detailCategories
          .aggregate([
            {
              $match: {
                id_sach: book._id
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

