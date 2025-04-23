import { Router } from "express";
import {
  loginController,
  logoutController,
  registerController,
  userInfoAccountController,
  updateUserController,
  getAllUsersController,
  forgotPassword,
  resetPassword,
  searchUsersByNameController,
  requestDeleteAccountController,
  cancelDeleteAccountController,
  cleanupExpiredAccountsController
} from "../controllers/users.controllers";
import {
  validateForgotPassword,
  validateForgotPasswordType,
  validateUpdateUser,
  validateUpdateUserFields,
} from "../middlewares/users.middlewares";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  loginValidator,
  logoutValidate,
  nameIsDuplicateMiddleware,
  registerValidate,
} from "../middlewares/users.middlewares";
import { handleValidationErrors, validatePagination } from "~/middlewares/books.middleware";
const usersRouter = Router();

usersRouter.post("/login", loginValidator, loginController);
usersRouter.post(
  '/forgot-password',
  validateForgotPasswordType,
  validateForgotPassword,
  handleValidationErrors,
  forgotPassword
);

usersRouter.post("/reset-password", resetPassword);
usersRouter.post(
  "/register",
  registerValidate,
  nameIsDuplicateMiddleware,
  registerController,
);
usersRouter.post("/logout", logoutController);

usersRouter.get("/user-info-account", userInfoAccountController);
usersRouter.put(
  "/update/:id",
  authMiddleware,
  validateUpdateUser,
  validateUpdateUserFields,
  handleValidationErrors,
  updateUserController
);

// Add new search route before the list route
usersRouter.get(
  "/search",
  authMiddleware,
  validatePagination,
  handleValidationErrors,
  searchUsersByNameController
);

usersRouter.get(
  "/list",
  authMiddleware,
  validatePagination,
  handleValidationErrors,
  getAllUsersController
);

// Account deletion routes
usersRouter.post(
  "/request-delete/:id",
  authMiddleware,
  requestDeleteAccountController
);

usersRouter.post(
  "/cancel-delete/:id",
  authMiddleware,
  cancelDeleteAccountController
);

// Admin route to clean up expired accounts
usersRouter.post(
  "/cleanup-expired",
  authMiddleware,
  cleanupExpiredAccountsController
);

export default usersRouter;
