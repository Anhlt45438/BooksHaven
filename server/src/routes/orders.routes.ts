import { Router } from 'express';
import { RolesType } from '~/constants/enum';
import { createOrder, getOrders, updateOrderStatus } from '~/controllers/orders.controllers';
import { authMiddleware } from '~/middlewares/auth.middleware';
import { validateCreateOrder } from '~/middlewares/orders.middleware'; 
import { checkUserRole } from '~/middlewares/role.middleware';

const ordersRouter = Router();

ordersRouter.get('/', authMiddleware, getOrders);
 
ordersRouter.patch('/:orderId/status', authMiddleware, checkUserRole([RolesType.Shop]),updateOrderStatus);
ordersRouter.post('/', validateCreateOrder, createOrder);

export default ordersRouter;