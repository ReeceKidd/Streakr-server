import { Router } from "express";
import { getCompleteTasksMiddlewares } from "../RouteMiddlewares/CompleteTask/getCompleteTasksMiddlewares";

export const completeTaskId = "completeTaskId";

const completeTasksRouter = Router();

completeTasksRouter.get(`/`, ...getCompleteTasksMiddlewares);

export default completeTasksRouter;
