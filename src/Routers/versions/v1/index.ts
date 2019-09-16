import { Router } from "express";

import { RouteCategories } from "../../../routeCategories";

import soloStreaksRouter from "./soloStreaksRouter";
import usersRouter from "./usersRouter";
import stripeRouter from "./stripeRouter";
import completeSoloStreakTasksRouter from "./completeSoloStreakTasksRouter";
import completeGroupMemberStreakTasksRouter from "./completeGroupMemberStreakTaskRouter";
import groupStreaksRouter from "./groupStreakRouter";
import streakTrackingEventRouter from "./streakTrackingEventRouter";
import agendaJobsRouter from "./agendaJobRouter";
import feedbackRouter from "./feedbackRouter";
import groupMemberStreakRouter from "./groupMemberStreaksRouter";
import { timezoneMiddlewares } from "../../../SharedMiddleware/timezoneMiddlewares";

const v1Router = Router();

v1Router.use(...timezoneMiddlewares);

v1Router.use(`/${RouteCategories.soloStreaks}`, soloStreaksRouter);
v1Router.use(`/${RouteCategories.users}`, usersRouter);
v1Router.use(`/${RouteCategories.stripe}`, stripeRouter);
v1Router.use(
  `/${RouteCategories.completeSoloStreakTasks}`,
  completeSoloStreakTasksRouter
);
v1Router.use(
  `/${RouteCategories.completeGroupMemberStreakTasks}`,
  completeGroupMemberStreakTasksRouter
);
v1Router.use(`/${RouteCategories.groupStreaks}`, groupStreaksRouter);
v1Router.use(
  `/${RouteCategories.streakTrackingEvents}`,
  streakTrackingEventRouter
);
v1Router.use(`/${RouteCategories.agendaJobs}`, agendaJobsRouter);
v1Router.use(`/${RouteCategories.feedbacks}`, feedbackRouter);
v1Router.use(`/${RouteCategories.groupMemberStreaks}`, groupMemberStreakRouter);

export default v1Router;
