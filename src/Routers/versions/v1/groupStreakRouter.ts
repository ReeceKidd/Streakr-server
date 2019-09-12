import { Router } from "express";
import { timezoneMiddlewares } from "../../../SharedMiddleware/timezoneMiddlewares";
import { createGroupStreakMiddlewares } from "../../../RouteMiddlewares/GroupStreak/createGroupStreakMiddlewares";
import { getGroupStreaksMiddlewares } from "../../../RouteMiddlewares/GroupStreak/getGroupStreaksMiddlewares";
import { deleteGroupStreakMiddlewares } from "../../../RouteMiddlewares/GroupStreak/deleteGroupStreakMiddlewares";
import { getGroupStreakMiddlewares } from "../../../RouteMiddlewares/GroupStreak/getGroupStreakMiddlewares";
import { patchGroupStreakMiddlewares } from "../../../RouteMiddlewares/GroupStreak/patchGroupStreakMiddlewares";
import { createGroupMemberMiddlewares } from "../../../RouteMiddlewares/GroupMember/createGroupMemberMiddlewares";

export const groupStreakId = "groupStreakId";

const groupStreaksRouter = Router();

export enum GroupStreakRouteCategories {
  members = "members"
}

groupStreaksRouter.get(`/`, ...getGroupStreaksMiddlewares);

groupStreaksRouter.get(`/:${groupStreakId}`, ...getGroupStreakMiddlewares);

groupStreaksRouter.delete(
  `/:${groupStreakId}`,
  ...deleteGroupStreakMiddlewares
);

groupStreaksRouter.use(...timezoneMiddlewares);

groupStreaksRouter.post(`/`, ...createGroupStreakMiddlewares);

groupStreaksRouter.patch(`/:${groupStreakId}`, ...patchGroupStreakMiddlewares);

groupStreaksRouter.post(
  `/:${groupStreakId}/${GroupStreakRouteCategories.members}`,
  ...createGroupMemberMiddlewares
);

export default groupStreaksRouter;
