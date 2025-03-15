import { Router } from "express";
import {
  createBook,
  updateBook,
  deleteBook,
  getBookById,
  getAllBooks,
  searchBooks,
} from "~/controllers/books.controller";
import {
  validateBookId,
  validateCreateBook,
  validateUpdateBook,
  validatePagination,
  validateSearchKeyword,
  handleValidationErrors
} from "~/middlewares/books.middleware";
import { authMiddleware } from "~/middlewares/auth.middleware";
import { checkUserRole } from "~/middlewares/role.middleware";
import { RolesType } from "~/constants/enum";

const booksRouter = Router();

// Protected routes - Only SHOP and ADMIN can create, update, delete books
booksRouter.post(
  "/",
  authMiddleware,
  checkUserRole([RolesType.Shop]), 
  validateCreateBook,
  handleValidationErrors,
  createBook
);

booksRouter.put(
  "/:id",
  authMiddleware,
  checkUserRole([RolesType.Shop]), 
  validateBookId,
  validateUpdateBook,
  handleValidationErrors,
  updateBook
);

booksRouter.delete(
  "/:id",
  authMiddleware,
  checkUserRole([RolesType.Shop]), 
  validateBookId,
  handleValidationErrors,
  deleteBook
);

// Public routes - Anyone can view and search books
booksRouter.get(
  "/:id",
  validateBookId,
  handleValidationErrors,
  getBookById
);

booksRouter.get(
  "/",
  validatePagination,
  handleValidationErrors,
  getAllBooks
);

booksRouter.get(
  "/search/keyword",
  validateSearchKeyword,
  handleValidationErrors,
  searchBooks
);



export default booksRouter;
