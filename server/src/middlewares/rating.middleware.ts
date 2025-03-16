import { checkSchema } from 'express-validator';
import { ObjectId } from 'mongodb';

export const validateRating = checkSchema({
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
  danh_gia: {
    isInt: {
      options: { min: 1, max: 5 },
      errorMessage: 'Rating must be between 1 and 5'
    }
  },
  binh_luan: {
    isString: {
      errorMessage: 'Comment must be a string'
    },
    trim: true,
    optional: true
  }
});