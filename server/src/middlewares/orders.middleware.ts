import { checkSchema } from 'express-validator';

export const validateCreateOrder = (
  checkSchema({
    'items.*.id_sach': {
      isString: true,
      notEmpty: true,
      errorMessage: 'Book ID is required'
    },
    'items.*.so_luong': {
      isInt: {
        options: { min: 1 },
        errorMessage: 'Quantity must be at least 1'
      }
    }
  })
);