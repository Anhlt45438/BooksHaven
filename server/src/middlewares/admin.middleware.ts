import { checkSchema } from 'express-validator';
import { ObjectId } from 'mongodb';
import { AccountStatus } from '~/constants/enum';

export const validateUserId = checkSchema({
  userId: {
    in: ['params'],
    custom: {
      options: (value) => {
        if (!ObjectId.isValid(value)) {
          throw new Error('Invalid user ID');
        }
        return true;
      }
    }
  }
});

export const validateUserStatus = checkSchema({
  status: {
    in: ['body'],
    isIn: {
      options: [Object.values(AccountStatus)],
      errorMessage: 'Invalid status value'
    }
  }
});

export const validateBookStatus = checkSchema({
  trang_thai: {
    in: ['body'],
    isBoolean: {
      errorMessage: 'Book status must be a boolean value'
    }
  }
});
