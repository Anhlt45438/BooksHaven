import { Router } from 'express';
import { calculateOrderTotal } from '~/controllers/payment.controller';
import { authMiddleware } from '~/middlewares/auth.middleware'; 
import { paymentValidator } from '~/middlewares/payment.middleware';

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

export default paymentsRouter;