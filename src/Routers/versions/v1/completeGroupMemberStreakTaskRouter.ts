import { Router } from "express";
import { createCompleteGroupMemberStreakTaskMiddlewares } from "../../../RouteMiddlewares/CompleteGroupMemberStreakTask/createCompleteGroupMemberStreakTaskMiddlewares";
import { timezoneMiddlewares } from "../../../SharedMiddleware/timezoneMiddlewares";
import { deleteCompleteGroupMemberStreakTaskMiddlewares } from "../../../RouteMiddlewares/CompleteGroupMemberStreakTask/deleteGroupMemberStreakTaskMiddlewares";

export const completeGroupMemberStreakTaskId =
  "completeGroupMemberStreakTaskId";

const completeGroupMemberStreakTasksRouter = Router();

completeGroupMemberStreakTasksRouter.delete(
  `/:${completeGroupMemberStreakTaskId}`,
  ...deleteCompleteGroupMemberStreakTaskMiddlewares
);

completeGroupMemberStreakTasksRouter.use(...timezoneMiddlewares);

completeGroupMemberStreakTasksRouter.post(
  `/`,
  ...createCompleteGroupMemberStreakTaskMiddlewares
);

export default completeGroupMemberStreakTasksRouter;
