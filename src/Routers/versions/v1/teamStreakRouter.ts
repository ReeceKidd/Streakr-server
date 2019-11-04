import { Router } from 'express';
import { getAllTeamStreaksMiddlewares } from '../../../RouteMiddlewares/TeamStreak/getAllTeamStreaksMiddlewares';
import { getOneTeamStreakMiddlewares } from '../../../RouteMiddlewares/TeamStreak/getOneTeamStreakMiddlewares';
import { deleteTeamMemberMiddlewares } from '../../../RouteMiddlewares/TeamMember/deleteTeamMemberMiddlewares';
import { createTeamStreakMiddlewares } from '../../../RouteMiddlewares/TeamStreak/createTeamStreakMiddlewares';
import { patchTeamStreakMiddlewares } from '../../../RouteMiddlewares/TeamStreak/patchTeamStreakMiddlewares';
import { createTeamMemberMiddlewares } from '../../../RouteMiddlewares/TeamMember/createTeamMemberMiddlewares';
import { authenticationMiddlewares } from '../../../../src/SharedMiddleware/authenticationMiddlewares';
import { hasUserPaidMembershipMiddleware } from '../../../../src/SharedMiddleware/hasUserPaidMembershipMiddleware';

export const teamStreakId = 'teamStreakId';

export const memberId = 'memberId';

const teamStreaksRouter = Router();

export enum TeamStreakRouteCategories {
    members = 'members',
}

teamStreaksRouter.get(`/`, ...getAllTeamStreaksMiddlewares);

teamStreaksRouter.get(`/:${teamStreakId}`, ...getOneTeamStreakMiddlewares);

teamStreaksRouter.use(...authenticationMiddlewares);
teamStreaksRouter.use(hasUserPaidMembershipMiddleware);

teamStreaksRouter.delete(
    `/:${teamStreakId}/${TeamStreakRouteCategories.members}/:${memberId}`,
    ...deleteTeamMemberMiddlewares,
);

teamStreaksRouter.post(`/`, ...createTeamStreakMiddlewares);

teamStreaksRouter.patch(`/:${teamStreakId}`, ...patchTeamStreakMiddlewares);

teamStreaksRouter.post(`/:${teamStreakId}/${TeamStreakRouteCategories.members}`, ...createTeamMemberMiddlewares);

export { teamStreaksRouter };
