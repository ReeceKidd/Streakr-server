import { Router } from "express";
import { getCompleteSoloStreakTasksMiddlewares } from "../../../RouteMiddlewares/CompleteSoloStreakTask/getCompleteSoloStreakTasksMiddlewares";
import { deleteCompleteSoloStreakTaskMiddlewares } from "../../../RouteMiddlewares/CompleteSoloStreakTask/deleteCompleteSoloStreakTaskMiddlewares";
import { createCompleteSoloStreakTaskMiddlewares } from "../../../RouteMiddlewares/CompleteSoloStreakTask/createCompleteSoloStreakTaskMiddlewares";
import { timezoneMiddlewares } from "../../../SharedMiddleware/timezoneMiddlewares";

export const completeSoloStreakTaskId = "completeSoloStreakTaskId";

const completeSoloStreakTasksRouter = Router();

completeSoloStreakTasksRouter.get(
  `/`,
  ...getCompleteSoloStreakTasksMiddlewares
);

completeSoloStreakTasksRouter.delete(
  `/:${completeSoloStreakTaskId}`,
  ...deleteCompleteSoloStreakTaskMiddlewares
);

completeSoloStreakTasksRouter.use(...timezoneMiddlewares);

completeSoloStreakTasksRouter.post(
  `/`,
  ...createCompleteSoloStreakTaskMiddlewares
);

export default completeSoloStreakTasksRouter;
