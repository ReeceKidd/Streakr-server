import { Router } from "express";

import { createTeamStreakMiddlewares } from "../../../RouteMiddlewares/teamStreak/createTeamStreakMiddlewares";
import { getAllTeamStreaksMiddlewares } from "../../../RouteMiddlewares/teamStreak/getAllTeamStreaksMiddlewares";
import { deleteTeamStreakMiddlewares } from "../../../RouteMiddlewares/teamStreak/deleteTeamStreakMiddlewares";
import { getOneTeamStreakMiddlewares } from "../../../RouteMiddlewares/teamStreak/getOneTeamStreakMiddlewares";
import { patchTeamStreakMiddlewares } from "../../../RouteMiddlewares/teamStreak/patchTeamStreakMiddlewares";
import { createGroupMemberMiddlewares } from "../../../RouteMiddlewares/GroupMember/createGroupMemberMiddlewares";
import { deleteGroupMemberMiddlewares } from "../../../RouteMiddlewares/GroupMember/deleteGroupMemberMiddlewares";

export const teamStreakId = "teamStreakId";

export const memberId = "memberId";

const teamStreaksRouter = Router();

export enum TeamStreakRouteCategories {
  members = "members"
}

teamStreaksRouter.get(`/`, ...getAllTeamStreaksMiddlewares);

teamStreaksRouter.get(`/:${teamStreakId}`, ...getOneTeamStreakMiddlewares);

teamStreaksRouter.delete(`/:${teamStreakId}`, ...deleteTeamStreakMiddlewares);

teamStreaksRouter.delete(
  `/:${teamStreakId}/${TeamStreakRouteCategories.members}/:${memberId}`,
  ...deleteGroupMemberMiddlewares
);

teamStreaksRouter.post(`/`, ...createTeamStreakMiddlewares);

teamStreaksRouter.patch(`/:${teamStreakId}`, ...patchTeamStreakMiddlewares);

teamStreaksRouter.post(
  `/:${teamStreakId}/${TeamStreakRouteCategories.members}`,
  ...createGroupMemberMiddlewares
);

export default teamStreaksRouter;
