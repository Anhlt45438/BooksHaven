import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import { checkSchema, validationResult } from 'express-validator';

export const validateCartItem = checkSchema({
  id_sach: {
    optional: true,
    custom: {
      options: (value) => {
        if (!ObjectId.isValid(value)) {
          throw new Error('Invalid book ID');
        }
        return true;
      }
    }
  },
  so_luong: {
    isInt: {
      options: { min: 1 },
      errorMessage: 'Quantity must be at least 1'
    }
  }
});