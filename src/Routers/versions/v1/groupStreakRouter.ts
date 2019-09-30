import { Router } from "express";

import { createGroupStreakMiddlewares } from "../../../RouteMiddlewares/GroupStreak/createGroupStreakMiddlewares";
import { getAllGroupStreaksMiddlewares } from "../../../RouteMiddlewares/GroupStreak/getAllGroupStreaksMiddlewares";
import { deleteGroupStreakMiddlewares } from "../../../RouteMiddlewares/GroupStreak/deleteGroupStreakMiddlewares";
import { getOneGroupStreakMiddlewares } from "../../../RouteMiddlewares/GroupStreak/getOneGroupStreakMiddlewares";
import { patchGroupStreakMiddlewares } from "../../../RouteMiddlewares/GroupStreak/patchGroupStreakMiddlewares";
import { createGroupMemberMiddlewares } from "../../../RouteMiddlewares/GroupMember/createGroupMemberMiddlewares";
import { deleteGroupMemberMiddlewares } from "../../../RouteMiddlewares/GroupMember/deleteGroupMemberMiddlewares";

export const groupStreakId = "groupStreakId";

export const memberId = "memberId";

const groupStreaksRouter = Router();

export enum GroupStreakRouteCategories {
  members = "members"
}

groupStreaksRouter.get(`/`, ...getAllGroupStreaksMiddlewares);

groupStreaksRouter.get(`/:${groupStreakId}`, ...getOneGroupStreakMiddlewares);

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
