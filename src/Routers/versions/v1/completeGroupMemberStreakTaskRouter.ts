import { Router } from "express";
import { createCompleteGroupMemberStreakTaskMiddlewares } from "../../../RouteMiddlewares/CompleteGroupMemberStreakTask/createCompleteGroupMemberStreakTaskMiddlewares";
import { timezoneMiddlewares } from "../../../SharedMiddleware/timezoneMiddlewares";
import { deleteCompleteGroupMemberStreakTaskMiddlewares } from "../../../RouteMiddlewares/CompleteGroupMemberStreakTask/deleteGroupMemberStreakTaskMiddlewares";
import { getCompleteGroupMemberStreakTasksMiddlewares } from "../../../RouteMiddlewares/CompleteGroupMemberStreakTask/getCompleteGroupMemberStreakTasksMiddlewares";

export const completeGroupMemberStreakTaskId =
  "completeGroupMemberStreakTaskId";

const completeGroupMemberStreakTasksRouter = Router();

completeGroupMemberStreakTasksRouter.get(
  `/`,
  ...getCompleteGroupMemberStreakTasksMiddlewares
);

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
