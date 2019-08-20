import { Router } from "express";
import { getCompleteTasksMiddlewares } from "../RouteMiddlewares/CompleteTask/getCompleteTasksMiddlewares";
import { deleteCompleteTaskMiddlewares } from "../RouteMiddlewares/CompleteTask/deleteCompleteTaskMiddlewares";
import { createCompleteTaskMiddlewares } from "../RouteMiddlewares/CompleteTask/createCompleteTaskMiddlewares";

export const completeTaskId = "completeTaskId";

const completeTasksRouter = Router();

completeTasksRouter.get(`/`, ...getCompleteTasksMiddlewares);

completeTasksRouter.post(`/`, ...createCompleteTaskMiddlewares);

completeTasksRouter.delete(
  `/:${completeTaskId}`,
  ...deleteCompleteTaskMiddlewares
);

export default completeTasksRouter;
