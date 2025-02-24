import { Router } from "express";
import {
  loginController,
  logoutController,
  registerController,
  userInfoAccountController,
} from "../controllers/users.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  loginValidator,
  logoutValidate,
  nameIsDuplicateMiddleware,
  registerValidate,
} from "../middlewares/users.middlewares";
const usersRouter = Router();

usersRouter.post("/login", loginValidator, loginController);
usersRouter.post(
  "/register",
  registerValidate,
  nameIsDuplicateMiddleware,
  registerController,
);
usersRouter.post("/logout", authMiddleware, logoutValidate, logoutController);

usersRouter.get("/user-info-account", userInfoAccountController);

export default usersRouter;
