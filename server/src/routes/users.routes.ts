import { Router } from "express";
import {
  loginController,
  logoutController,
  registerController,
  userInfoAccountController,
} from "../controllers/users.controllers";
import { authMiddeware } from "../middelwares/auth.middleware";
import {
  loginValidator,
  logoutValidate,
  nameIsDuplicateMiddleware,
  registerValidate,
} from "../middelwares/users.middlewares";
const usersRouter = Router();

usersRouter.post("/login", loginValidator, loginController);
usersRouter.post(
  "/register",
  registerValidate,
  nameIsDuplicateMiddleware,
  registerController,
);
usersRouter.post("/logout", authMiddeware, logoutValidate, logoutController);

usersRouter.get("/user-info-account", userInfoAccountController);

export default usersRouter;
