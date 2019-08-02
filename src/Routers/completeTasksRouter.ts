import { Router } from "express";
import { getCompleteTasksMiddlewares } from "../RouteMiddlewares/CompleteTask/getCompleteTasksMiddlewares";
import { deleteCompleteTaskMiddlewares } from "../RouteMiddlewares/CompleteTask/deleteCompleteTaskMiddlewares";

export const completeTaskId = "completeTaskId";

const completeTasksRouter = Router();

completeTasksRouter.get(`/`, ...getCompleteTasksMiddlewares);

completeTasksRouter.delete(
  `/${completeTaskId}`,
  ...deleteCompleteTaskMiddlewares
);

export default completeTasksRouter;
