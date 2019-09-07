import { Router } from "express";

import soloStreaksRouter from "./soloStreaksRouter";
import usersRouter from "./usersRouter";
import stripeRouter from "./stripeRouter";
import completeTasksRouter from "./completeTasksRouter";

import { RouteCategories } from "../../../routeCategories";
import groupStreaksRouter from "./groupStreakRouter";
import streakTrackingEventRouter from "./streakTrackingEventRouter";
import agendaJobsRouter from "./agendaJobRouter";
import feedbackRouter from "./feedbackRouter";

const v1Router = Router();

v1Router.use(`/${RouteCategories.soloStreaks}`, soloStreaksRouter);
v1Router.use(`/${RouteCategories.users}`, usersRouter);
v1Router.use(`/${RouteCategories.stripe}`, stripeRouter);
v1Router.use(`/${RouteCategories.completeTasks}`, completeTasksRouter);
v1Router.use(`/${RouteCategories.groupStreaks}`, groupStreaksRouter);
v1Router.use(
  `/${RouteCategories.streakTrackingEvents}`,
  streakTrackingEventRouter
);
v1Router.use(`/${RouteCategories.agendaJobs}`, agendaJobsRouter);
v1Router.use(`/${RouteCategories.feedbacks}`, feedbackRouter);

export default v1Router;
