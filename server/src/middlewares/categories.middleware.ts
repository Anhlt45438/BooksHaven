import { Request, Response, NextFunction } from 'express';
import { checkSchema } from 'express-validator';
import { ObjectId } from 'mongodb';
import databaseServices from '~/services/database.services';

export const categoryValidator = (
  checkSchema({
    ten_the_loai: {
      notEmpty: {
        errorMessage: 'Category name is required'
      },
      isString: {
        errorMessage: 'Category name must be a string'
      },
      trim: true,
      isLength: {
        options: { min: 1, max: 100 },
        errorMessage: 'Category name must be between 1 and 100 characters'
      }
    }
  })
);

export const validateCategoryId = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      message: 'Invalid category ID format'
    });
  }

  next();
};

export const validateBookCategoryAssociation = async (req: Request, res: Response, next: NextFunction) => {
  const { id_sach, id_the_loai } = req.body;

  if (!ObjectId.isValid(id_sach) || !ObjectId.isValid(id_the_loai)) {
    return res.status(400).json({
      message: 'Invalid book ID or category ID format'
    });
  }

  // Check if book exists
  const book = await databaseServices.books.findOne({
    _id: new ObjectId(id_sach)
  });

  if (!book) {
    return res.status(404).json({
      message: 'Book not found'
    });
  }

  // Check if category exists
  const category = await databaseServices.categories.findOne({
    _id: new ObjectId(id_the_loai)
  });

  if (!category) {
    return res.status(404).json({
      message: 'Category not found'
    });
  }

  next();
};