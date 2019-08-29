import { Router } from "express";
import { timezoneMiddlewares } from "../../../SharedMiddleware/timezoneMiddlewares";
import { createGroupStreakMiddlewares } from "../../../RouteMiddlewares/GroupStreak/createGroupStreakMiddlewares";

const groupStreaksRouter = Router();

groupStreaksRouter.use(...timezoneMiddlewares);

groupStreaksRouter.post(`/`, ...createGroupStreakMiddlewares);

export default groupStreaksRouter;
