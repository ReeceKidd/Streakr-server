import { Router } from "express";
import { createCompleteGroupMemberStreakTaskMiddlewares } from "../../../RouteMiddlewares/CompleteGroupMemberStreakTask/createCompleteGroupMemberStreakTaskMiddlewares";
import { timezoneMiddlewares } from "../../../SharedMiddleware/timezoneMiddlewares";

export const completeGroupMemberStreakTaskId =
  "completeGroupMemberStreakTaskId";

const completeGroupMemberStreakTasksRouter = Router();

completeGroupMemberStreakTasksRouter.use(...timezoneMiddlewares);

completeGroupMemberStreakTasksRouter.post(
  `/`,
  ...createCompleteGroupMemberStreakTaskMiddlewares
);

export default completeGroupMemberStreakTasksRouter;
