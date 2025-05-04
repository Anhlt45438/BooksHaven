import { Router } from 'express';
import { 
  calculateOrderTotal, 
  createPaymentUrlController, 
  vnpayReturnController,
  getPaymentHistory,
  getPaymentById
} from '~/controllers/payment.controller';
import { authMiddleware } from '~/middlewares/auth.middleware';

const paymentsRouter = Router();

paymentsRouter.post('/calculate-total-amount', authMiddleware, calculateOrderTotal);
paymentsRouter.post('/create-payment-url', authMiddleware, createPaymentUrlController);
paymentsRouter.get('/vnpay-return', vnpayReturnController);
paymentsRouter.get('/history', authMiddleware, getPaymentHistory);
paymentsRouter.get('/:paymentId', authMiddleware, getPaymentById);

export default paymentsRouter;