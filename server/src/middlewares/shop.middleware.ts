import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import databaseServices from '~/services/database.services';
import { checkSchema } from 'express-validator';

export const checkUserHasShop = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;
        
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: 'Invalid user ID format'
            });
        }

        const shop = await databaseServices.shops.findOne({
            id_user: new ObjectId(userId)
        });

        if (!shop) {
            return res.status(404).json({
                message: 'No shop found for this user'
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Error checking shop existence'
        });
    }
};

export const validateUpdateShop = checkSchema({
  ten_shop: {
    optional: true,
    isString: {
      errorMessage: 'Shop name must be a string'
    },
    trim: true,
    custom: {
      options: async (value, { req }) => {
        if (!value) return true;
        const existingShop = await databaseServices.shops.findOne({
          ten_shop: value,
          _id: { $ne: new ObjectId(req.params?.id || '') }
        });
        if (existingShop) {
          throw new Error('Shop name already exists');
        }
        return true;
      }
    }
  },
  anh_shop: {
    optional: true,
    isString: {
      errorMessage: 'Shop image must be a string'
    },
    trim: true
  },
  mo_ta: {
    optional: true,
    isString: {
      errorMessage: 'Description must be a string'
    },
    trim: true
  },
  trang_thai: {
    optional: true,
    isBoolean: {
      errorMessage: 'Status must be a boolean'
    }
  }
}, ); // Only allow these fields, reject if extra fields are present

export const checkShopOwnership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shopId = req.params.id;
    const userId = req.decoded?.user_id;

    const shop = await databaseServices.shops.findOne({
      _id: new ObjectId(shopId),
      id_user: new ObjectId(userId)
    });

    if (!shop) {
      return res.status(403).json({
        message: 'You do not have permission to update this shop'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: 'Error checking shop ownership'
    });
  }
};
