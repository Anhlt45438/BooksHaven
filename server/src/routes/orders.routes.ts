import { Router } from 'express';
import { RolesType } from '~/constants/enum';
import { createOrder, getOrdersByShop, getOrdersByUser, updateOrderStatus } from '~/controllers/orders.controllers';
import { authMiddleware } from '~/middlewares/auth.middleware';
import { validateCreateOrder } from '~/middlewares/orders.middleware'; 
import { checkUserRole } from '~/middlewares/role.middleware';

const ordersRouter = Router();

ordersRouter.get('/user', authMiddleware, getOrdersByUser);
ordersRouter.get('/shop', authMiddleware, getOrdersByShop);

 
ordersRouter.patch('/:orderId/status', authMiddleware, checkUserRole([RolesType.Shop]),updateOrderStatus);
ordersRouter.post('/', authMiddleware, validateCreateOrder, createOrder);

export default ordersRouter;