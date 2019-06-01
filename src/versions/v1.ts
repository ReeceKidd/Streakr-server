import { Router } from "express";

import authRouter from "../Routers/authRouter";
import soloStreaksRouter from "../Routers/soloStreaksRouter";
import testRouter from "../Routers/testRouter";
import usersRouter from "../Routers/usersRouter";
import { RouteCategories } from "../routeCategories";

const v1Router = Router();

v1Router.use(`/${RouteCategories.soloStreaks}`, soloStreaksRouter);
v1Router.use(`/${RouteCategories.users}`, usersRouter);
v1Router.use(`/${RouteCategories.auth}`, authRouter);
v1Router.use(`/${RouteCategories.test}`, testRouter);



export default v1Router;
