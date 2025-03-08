import { Router } from 'express';
import { 
  createCategory, 
  getAllCategories, 
  getCategoryById, 
  updateCategory, 
  deleteCategory,
  addCategoryToBook,
  removeCategoryFromBook
} from '~/controllers/category.controller';
import { 
  categoryValidator, 
  validateCategoryId,
  validateBookCategoryAssociation 
} from '~/middlewares/categories.middleware';
import { authMiddleware } from '~/middlewares/auth.middleware';
import { checkUserRole } from '~/middlewares/role.middleware';
import { RolesType } from '~/constants/enum';

const categoriesRouter = Router();

// Public routes
categoriesRouter.get('/', getAllCategories);
categoriesRouter.get('/:id', validateCategoryId, getCategoryById);

// Protected routes (Admin only)
categoriesRouter.post(
  '/create',
  authMiddleware,
  checkUserRole([RolesType.Admin]),
  categoryValidator,
  createCategory
);

categoriesRouter.put(
  '/:id',
  authMiddleware,
  checkUserRole([RolesType.Admin]),
  validateCategoryId,
  categoryValidator,
  updateCategory
);

categoriesRouter.delete(
  '/:id',
  authMiddleware,
  checkUserRole([RolesType.Admin]),
  validateCategoryId,
  deleteCategory
);

// Book-Category association routes
categoriesRouter.post(
  '/book-association',
  authMiddleware,
  checkUserRole([RolesType.Admin, RolesType.Shop]),
  validateBookCategoryAssociation,
  addCategoryToBook
);

categoriesRouter.delete(
  '/book-association/:id_sach/:id_the_loai',
  authMiddleware,
  checkUserRole([RolesType.Admin, RolesType.Shop]),
  validateBookCategoryAssociation,
  removeCategoryFromBook
);

export default categoriesRouter;