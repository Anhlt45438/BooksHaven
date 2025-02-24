import { Router } from "express";
import usersRouter from "./users.routes";

const routersApp = Router();
routersApp.use("/user", usersRouter);

export default routersApp;