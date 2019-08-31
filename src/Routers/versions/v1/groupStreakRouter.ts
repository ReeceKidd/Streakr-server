import { Router } from "express";
import { timezoneMiddlewares } from "../../../SharedMiddleware/timezoneMiddlewares";
import { createGroupStreakMiddlewares } from "../../../RouteMiddlewares/GroupStreak/createGroupStreakMiddlewares";
import { getGroupStreaksMiddlewares } from "../../../RouteMiddlewares/GroupStreak/getGroupStreaksMiddlewares";
import { deleteGroupStreakMiddlewares } from "../../../RouteMiddlewares/GroupStreak/deleteGroupStreakMiddlewares";

export const groupStreakId = "groupStreakId";

const groupStreaksRouter = Router();

groupStreaksRouter.get(`/`, ...getGroupStreaksMiddlewares);

groupStreaksRouter.delete(
  `/:${groupStreakId}`,
  ...deleteGroupStreakMiddlewares
);

groupStreaksRouter.use(...timezoneMiddlewares);

groupStreaksRouter.post(`/`, ...createGroupStreakMiddlewares);

export default groupStreaksRouter;
