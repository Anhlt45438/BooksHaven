import { Router } from 'express';
import { 
  calculateOrderTotal, 
  createPaymentUrlController, 
  vnpayReturnController,
  getPaymentHistory,
  getPaymentById
} from '~/controllers/payment.controller';
import { authMiddleware } from '~/middlewares/auth.middleware';
import { validateCreateOrder } from '~/middlewares/orders.middleware';
import { paymentValidator, vnPayValidator } from '~/middlewares/payment.middleware';

const paymentsRouter = Router();

paymentsRouter.post('/calculate', authMiddleware, calculateOrderTotal);
paymentsRouter.post('/create-payment-url', authMiddleware, createPaymentUrlController);
paymentsRouter.get('/vnpay-return', vnpayReturnController);
paymentsRouter.get('/history', authMiddleware, getPaymentHistory);
paymentsRouter.get('/:paymentId', authMiddleware, getPaymentById);
paymentsRouter.post(
  '/calculate-total-amount',
  authMiddleware,
  paymentValidator,
  calculateOrderTotal
);
paymentsRouter.get("/vnpay-return", vnpayReturnController);
paymentsRouter.post('/create-vnpay-payment', 
  authMiddleware, 
  vnPayValidator,
  validateCreateOrder,
  createPaymentUrlController
);
export default paymentsRouter;