import { Router } from "express";
import { deleteCompleteTaskMiddlewares } from "../RouteMiddlewares/CompleteTask/deleteCompleteTaskMiddlewares";

export const completeTaskId = "userId";

const completeTasksRouter = Router();

completeTasksRouter.delete(
  `/${completeTaskId}`,
  ...deleteCompleteTaskMiddlewares
);

export default completeTasksRouter;
