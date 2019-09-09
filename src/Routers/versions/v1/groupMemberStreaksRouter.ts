import { Router } from "express";

import { timezoneMiddlewares } from "../../../SharedMiddleware/timezoneMiddlewares";
import { createGroupMemberStreakMiddlewares } from "../../../RouteMiddlewares/GroupMemberStreak/createGroupMemberStreakMiddlewares";
import { deleteGroupMemberStreakMiddlewares } from "../../../RouteMiddlewares/GroupMemberStreak/deleteGroupMemberStreakMiddlewares";

export const groupMemberStreakId = "groupMemberStreakId";

const groupMemberStreaksRouter = Router();

groupMemberStreaksRouter.delete(
  `/:${groupMemberStreakId}`,
  ...deleteGroupMemberStreakMiddlewares
);

groupMemberStreaksRouter.use(...timezoneMiddlewares);

groupMemberStreaksRouter.post(`/`, ...createGroupMemberStreakMiddlewares);

export default groupMemberStreaksRouter;
