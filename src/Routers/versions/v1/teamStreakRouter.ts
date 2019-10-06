import { Router } from "express";
import { getAllTeamStreaksMiddlewares } from "../../../RouteMiddlewares/TeamStreak/getAllTeamStreaksMiddlewares";
import { getOneTeamStreakMiddlewares } from "../../../RouteMiddlewares/TeamStreak/getOneTeamStreakMiddlewares";
import { deleteTeamStreakMiddlewares } from "../../../RouteMiddlewares/TeamStreak/deleteTeamStreakMiddlewares";
import { deleteGroupMemberMiddlewares } from "../../../RouteMiddlewares/GroupMember/deleteGroupMemberMiddlewares";
import { createTeamStreakMiddlewares } from "../../../RouteMiddlewares/TeamStreak/createTeamStreakMiddlewares";
import { patchTeamStreakMiddlewares } from "../../../RouteMiddlewares/TeamStreak/patchTeamStreakMiddlewares";
import { createGroupMemberMiddlewares } from "../../../RouteMiddlewares/GroupMember/createGroupMemberMiddlewares";

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
