import { Router } from "express";

import soloStreaksRouter from "../Routers/soloStreaksRouter";
import usersRouter from "../Routers/usersRouter";
import stripeRouter from "../Routers/stripeRouter";
import completeTasksRouter from "../Routers/completeTasksRouter";

import { RouteCategories } from "../routeCategories";

const v1Router = Router();

v1Router.use(`/${RouteCategories.soloStreaks}`, soloStreaksRouter);
v1Router.use(`/${RouteCategories.users}`, usersRouter);
v1Router.use(`/${RouteCategories.stripe}`, stripeRouter);
v1Router.use(`/${RouteCategories.completeTasks}`, completeTasksRouter);

export default v1Router;
