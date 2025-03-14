import { Router } from 'express';
import { 
  createRating, 
  updateRating, 
  deleteRating, 
  getBookRatings 
} from '~/controllers/rating.controller';
import { authMiddleware } from '~/middlewares/auth.middleware';
import { validateRating } from '~/middlewares/rating.middleware'; 
import { handleValidationErrors } from '~/middlewares/books.middleware';

const ratingRouter = Router();

ratingRouter.post(
  '/',
  authMiddleware,
  validateRating,
  handleValidationErrors,
  createRating
);

ratingRouter.put(
  '/:id',
  authMiddleware,
  validateRating,
  handleValidationErrors,
  updateRating
);

ratingRouter.delete(
  '/:id',
  authMiddleware,
  deleteRating
);

ratingRouter.get(
  '/book/:id_sach',
  getBookRatings
);

export default ratingRouter;