import { Router } from "express";
import usersRouter from "./users.routes";
import booksRouter from "./books.routes";
import rolesRouter from "./roles.routes";
import shopRouter from "./shop.routes";
import categoriesRouter from "./categories.routes";
import cartRouter from "./cart.routes";
import adminRouter from "./admin.routes";
import ratingRouter from "./rating.routes";

const routersApp = Router();
routersApp.use("/users", usersRouter);
routersApp.use("/books", booksRouter);
routersApp.use("/roles", rolesRouter);
routersApp.use('/shops', shopRouter);
routersApp.use('/categories', categoriesRouter);
routersApp.use('/cart', cartRouter);
routersApp.use('/admin', adminRouter);
routersApp.use('/ratings', ratingRouter);






export default routersApp;