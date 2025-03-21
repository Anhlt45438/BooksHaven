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

export const vnPayValidator = (
  checkSchema({
    amount: {
      isInt: {
        errorMessage: 'Amount must be an integer'
      },
      custom: {
        options: (value) => {
          if (value <= 0) {
            throw new Error('Amount must be greater than 0');
          }
          return true;
        }
      }
    },
    bankCode: {
      isString: true,
      equals: {
        options: 'NCB',
        errorMessage: 'Bank code must be NCB'
      }
    }
  })
);