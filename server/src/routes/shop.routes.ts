import { Router } from 'express';
import { createShop, getShopByUserId, getShopInfo, updateShop, getShopProducts, getShopProductsByIdUser, getShopProductsByIdShop, getShopProductsByStatus, getShopOwnerInfo, withdrawMoneyShop, getWithdrawalHistory } from '~/controllers/shop.controllers';
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
    "/withdrawal",
    authMiddleware,
    checkUserRole([RolesType.Shop]),
    withdrawMoneyShop
)

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

shopRouter.get(
  '/books',
  authMiddleware,
//   checkUserRole([RolesType.Shop]),
  getShopProducts
);

// Add this route
shopRouter.get(
  '/products/:id',
  getShopProductsByIdUser
);
shopRouter.get(
  '/products/id-shop/:id',
  getShopProductsByIdShop
);
shopRouter.post(
  '/products/status',
  authMiddleware,
  checkUserRole([RolesType.Shop]),
  getShopProductsByStatus
);

shopRouter.get('/owner/:id', getShopOwnerInfo);

shopRouter.get(
  '/withdrawal-history',
  authMiddleware,
  checkUserRole([RolesType.Shop]),
  getWithdrawalHistory
);

export default shopRouter;