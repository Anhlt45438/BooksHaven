import { Router } from "express";
import usersRouter from "./users.routes";
import booksRouter from "./books.routes";
import rolesRouter from "./roles.routers";

const routersApp = Router();
routersApp.use("/users", usersRouter);
routersApp.use("/books", booksRouter);
routersApp.use("/roles", rolesRouter);


export default routersApp;