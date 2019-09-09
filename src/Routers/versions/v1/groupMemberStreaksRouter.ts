import { Router } from "express";

import { timezoneMiddlewares } from "../../../SharedMiddleware/timezoneMiddlewares";
import { createGroupMemberStreakMiddlewares } from "../../../RouteMiddlewares/GroupMemberStreak/createGroupMemberStreakMiddlewares";

export const groupMemberStreakId = "groupMemberStreakId";

const groupMemberStreaksRouter = Router();

groupMemberStreaksRouter.use(...timezoneMiddlewares);

groupMemberStreaksRouter.post(`/`, ...createGroupMemberStreakMiddlewares);

export default groupMemberStreaksRouter;
