import { Request, Response, NextFunction } from 'express';
import { checkSchema } from 'express-validator';

export const paymentValidator = (
  checkSchema({
    items: {
      isArray: true,
      errorMessage: 'items must be an array'
    },
    'items.*.id_sach': {
      isString: true,
      notEmpty: true,
      errorMessage: 'Each item must have a valid id_sach'
    },
    'items.*.so_luong': {
      isInt: {
        options: { min: 1 }
      },
      errorMessage: 'Quantity must be at least 1'
    }
  })
);