import { Router } from "express";
import usersRouter from "./users.routes";
import booksRouter from "./books.routes";
import rolesRouter from "./roles.routers";
import shopRouter from "./shop.routes";
import categoriesRouter from "./categories.routes";

const routersApp = Router();
routersApp.use("/users", usersRouter);
routersApp.use("/books", booksRouter);
routersApp.use("/roles", rolesRouter);
routersApp.use('/shops', shopRouter);
routersApp.use('/categories', categoriesRouter);


export default routersApp;