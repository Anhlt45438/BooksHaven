import { Router } from 'express';
import { calculateOrderTotal, createPaymentUrlController, vnpayReturnController } from '~/controllers/payment.controller';
import { authMiddleware } from '~/middlewares/auth.middleware'; 
import { Request, Response } from 'express';

import { paymentValidator, vnPayValidator } from '~/middlewares/payment.middleware';

const paymentsRouter = Router();
paymentsRouter.get('/', (req, res) => {
  res.send('Hello World!');
});
paymentsRouter.post(
  '/calculate-total-amount',
  authMiddleware,
  paymentValidator,
  calculateOrderTotal
);
paymentsRouter.get("/vnpay-return", vnpayReturnController);
paymentsRouter.post('/create-vnpay-payment', authMiddleware, vnPayValidator, createPaymentUrlController);
export default paymentsRouter;