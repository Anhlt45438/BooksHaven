import { Request, Response } from 'express';
import sachService from '~/services/sach.services';
import { ObjectId } from 'mongodb';

export const createBook = async (req: Request, res: Response) => {
  try {
    const result = await sachService.createSach(req.body);
    return res.status(201).json({
      message: 'Create book successfully',
      data: result
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

    return res.status(200).json({
      data: book
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

    return res.status(200).json({
      data: result.sach,
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
