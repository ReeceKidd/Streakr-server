import { Router } from "express";
import { getCompleteTasksMiddlewares } from "../../../RouteMiddlewares/CompleteTask/getCompleteTasksMiddlewares";
import { deleteCompleteTaskMiddlewares } from "../../../RouteMiddlewares/CompleteTask/deleteCompleteTaskMiddlewares";
import { createCompleteTaskMiddlewares } from "../../../RouteMiddlewares/CompleteTask/createCompleteTaskMiddlewares";
import { timezoneMiddlewares } from "../../../SharedMiddleware/timezoneMiddlewares";

export const completeTaskId = "completeTaskId";

const completeTasksRouter = Router();

completeTasksRouter.get(`/`, ...getCompleteTasksMiddlewares);

completeTasksRouter.delete(
  `/:${completeTaskId}`,
  ...deleteCompleteTaskMiddlewares
);

completeTasksRouter.use(...timezoneMiddlewares);

completeTasksRouter.post(`/`, ...createCompleteTaskMiddlewares);

export default completeTasksRouter;
