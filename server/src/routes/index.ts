import { Router } from "express";
import usersRouter from "./users.routes";
import booksRouter from "./books.routes";

const routersApp = Router();
routersApp.use("/users", usersRouter);
routersApp.use("/books", booksRouter);


export default routersApp;