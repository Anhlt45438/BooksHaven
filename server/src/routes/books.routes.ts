import { Router } from "express";
import {
  createBook,
  updateBook,
  deleteBook,
  getBookById,
  getAllBooks,
  searchBooks
} from "~/controllers/books.controller";
import {
  validateBookId,
  validateCreateBook,
  validateUpdateBook,
  validatePagination,
  validateSearchKeyword,
  handleValidationErrors
} from "~/middlewares/books.middleware";
import { authMiddleware, checkRole } from "~/middlewares/auth.middleware";
import { UserRole } from "~/types/user.type";

const booksRouter = Router();

// Protected routes - Only SHOP and ADMIN can create, update, delete books
booksRouter.post(
  "/",
  authMiddleware,
  checkRole([UserRole.SHOP, UserRole.ADMIN]),
  validateCreateBook,
  handleValidationErrors,
  createBook
);

booksRouter.put(
  "/:id",
  authMiddleware,
  checkRole([UserRole.SHOP, UserRole.ADMIN]),
  validateBookId,
  validateUpdateBook,
  handleValidationErrors,
  updateBook
);

booksRouter.delete(
  "/:id",
  authMiddleware,
  checkRole([UserRole.SHOP, UserRole.ADMIN]),
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
  "/search",
  validateSearchKeyword,
  handleValidationErrors,
  searchBooks
);

export default booksRouter;
