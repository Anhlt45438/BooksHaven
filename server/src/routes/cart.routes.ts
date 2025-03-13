import { Router } from 'express';
import { authMiddleware } from '~/middlewares/auth.middleware';
import { 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  getCart 
} from '~/controllers/cart.controller';
import { validateCartItem } from '~/middlewares/cart.middleware'; 

const cartRouter = Router();

cartRouter.post('/add', 
  authMiddleware, 
  validateCartItem, 
  addToCart
);

cartRouter.put('/update/:id_ctgh', 
  authMiddleware, 
  validateCartItem, 
  updateCartItem
);

cartRouter.delete('/remove/:id_ctgh', 
  authMiddleware, 
  removeFromCart
);

cartRouter.get('/', 
  authMiddleware, 
  getCart
);

export default cartRouter;