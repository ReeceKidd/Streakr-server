import { Router } from "express";
import { timezoneMiddlewares } from "../../../SharedMiddleware/timezoneMiddlewares";
import { createGroupStreakMiddlewares } from "../../../RouteMiddlewares/GroupStreak/createGroupStreakMiddlewares";
import { getGroupStreaksMiddlewares } from "../../../RouteMiddlewares/GroupStreak/getGroupStreaksMiddlewares";
import { deleteGroupStreakMiddlewares } from "../../../RouteMiddlewares/GroupStreak/deleteGroupStreakMiddlewares";
import { getGroupStreakMiddlewares } from "../../../RouteMiddlewares/GroupStreak/getGroupStreakMiddlewares";
import { patchGroupStreakMiddlewares } from "../../../RouteMiddlewares/GroupStreak/patchGroupStreakMiddlewares";
import { createGroupMemberMiddlewares } from "../../../RouteMiddlewares/GroupMember/createGroupMemberMiddlewares";
import { deleteGroupMemberMiddlewares } from "../../../RouteMiddlewares/GroupMember/deleteGroupMemberMiddlewares";

export const groupStreakId = "groupStreakId";

export const memberId = "memberId";

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

groupStreaksRouter.delete(
  `/:${groupStreakId}/${GroupStreakRouteCategories.members}/:${memberId}`,
  ...deleteGroupMemberMiddlewares
);

groupStreaksRouter.post(`/`, ...createGroupStreakMiddlewares);

groupStreaksRouter.patch(`/:${groupStreakId}`, ...patchGroupStreakMiddlewares);

groupStreaksRouter.post(
  `/:${groupStreakId}/${GroupStreakRouteCategories.members}`,
  ...createGroupMemberMiddlewares
);

export default groupStreaksRouter;
