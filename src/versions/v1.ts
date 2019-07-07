import { Router } from "express";

import authRouter from "../Routers/authRouter";
import soloStreaksRouter from "../Routers/soloStreaksRouter";
import usersRouter from "../Routers/usersRouter";
import { RouteCategories } from "../routeCategories";

const v1Router = Router();

v1Router.use(`/${RouteCategories.soloStreaks}`, soloStreaksRouter);
v1Router.use(`/${RouteCategories.users}`, usersRouter);
v1Router.use(`/${RouteCategories.auth}`, authRouter);

export default v1Router;
