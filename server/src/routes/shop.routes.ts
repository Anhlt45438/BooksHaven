import { Router } from 'express';
import { createShop, getShopByUserId, getShopInfo } from '~/controllers/shop.controllers';
import { authMiddleware } from '~/middlewares/auth.middleware';
import { checkUserRole } from '~/middlewares/role.middleware';
import { RolesType } from '~/constants/enum';
import { checkUserHasShop } from '~/middlewares/shop.middleware';

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

export default shopRouter;