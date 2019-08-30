import { Router } from "express";
import { timezoneMiddlewares } from "../../../SharedMiddleware/timezoneMiddlewares";
import { createGroupStreakMiddlewares } from "../../../RouteMiddlewares/GroupStreak/createGroupStreakMiddlewares";
import { getGroupStreaksMiddlewares } from "../../../RouteMiddlewares/GroupStreak/getGroupStreaksMiddlewares";

const groupStreaksRouter = Router();

groupStreaksRouter.get(`/`, ...getGroupStreaksMiddlewares);

groupStreaksRouter.use(...timezoneMiddlewares);

groupStreaksRouter.post(`/`, ...createGroupStreakMiddlewares);

export default groupStreaksRouter;
