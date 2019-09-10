import { Router } from "express";

import { timezoneMiddlewares } from "../../../SharedMiddleware/timezoneMiddlewares";
import { createGroupMemberStreakMiddlewares } from "../../../RouteMiddlewares/GroupMemberStreak/createGroupMemberStreakMiddlewares";
import { deleteGroupMemberStreakMiddlewares } from "../../../RouteMiddlewares/GroupMemberStreak/deleteGroupMemberStreakMiddlewares";
import { getGroupMemberStreakMiddlewares } from "../../../RouteMiddlewares/GroupMemberStreak/getGroupMemberStreakMiddlewares";

export const groupMemberStreakId = "groupMemberStreakId";

const groupMemberStreaksRouter = Router();

groupMemberStreaksRouter.get(
  `/:${groupMemberStreakId}`,
  ...getGroupMemberStreakMiddlewares
);

groupMemberStreaksRouter.delete(
  `/:${groupMemberStreakId}`,
  ...deleteGroupMemberStreakMiddlewares
);

groupMemberStreaksRouter.use(...timezoneMiddlewares);

groupMemberStreaksRouter.post(`/`, ...createGroupMemberStreakMiddlewares);

export default groupMemberStreaksRouter;
