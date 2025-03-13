import { Router } from 'express';
import { createShop, getShopByUserId, getShopInfo, updateShop } from '~/controllers/shop.controllers';
import { authMiddleware } from '~/middlewares/auth.middleware';
import { checkUserRole } from '~/middlewares/role.middleware';
import { RolesType } from '~/constants/enum';
import { checkUserHasShop } from '~/middlewares/shop.middleware';
import { validateUpdateShop, checkShopOwnership } from '~/middlewares/shop.middleware';
import { handleValidationErrors } from '~/middlewares/books.middleware'; 

const shopRouter = Router();

// Create shop route - requires authentication and shop role
shopRouter.post(
    '/create', 
    authMiddleware, 
    checkUserRole([RolesType.User]), 
    createShop
);
shopRouter.post(
    '/get-shop-info/:id', 
    getShopInfo
);

shopRouter.get(
    '/get-shop-info-from-user-id/:userId',
    checkUserHasShop,
    getShopByUserId
);

shopRouter.put(
  '/update/:id',
  authMiddleware,
  checkUserRole([RolesType.Shop]),
  checkShopOwnership,
  validateUpdateShop,
  handleValidationErrors,
  updateShop
);

export default shopRouter;