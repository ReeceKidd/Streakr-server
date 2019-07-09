import { Router } from "express";

import soloStreaksRouter from "../Routers/soloStreaksRouter";
import usersRouter from "../Routers/usersRouter";
import { RouteCategories } from "../routeCategories";

const v1Router = Router();

v1Router.use(`/${RouteCategories.soloStreaks}`, soloStreaksRouter);
v1Router.use(`/${RouteCategories.users}`, usersRouter);

export default v1Router;
