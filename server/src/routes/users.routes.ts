import { Router } from "express";
import {
  loginController,
  logoutController,
  registerController,
  userInfoAccountController,
  updateUserController,
  getAllUsersController, // Add this
  forgotPassword,
  resetPassword
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

usersRouter.get(
  "/list",
  authMiddleware,
  validatePagination,
  handleValidationErrors,
  getAllUsersController
);

export default usersRouter;
