import { Router } from 'express';
import { getAllTeamStreaksMiddlewares } from '../../../RouteMiddlewares/TeamStreaks/getAllTeamStreaksMiddlewares';
import { getOneTeamStreakMiddlewares } from '../../../RouteMiddlewares/TeamStreaks/getOneTeamStreakMiddlewares';
import { deleteTeamMemberMiddlewares } from '../../../RouteMiddlewares/TeamMembers/deleteTeamMemberMiddlewares';
import { createTeamStreakMiddlewares } from '../../../RouteMiddlewares/TeamStreaks/createTeamStreakMiddlewares';
import { patchTeamStreakMiddlewares } from '../../../RouteMiddlewares/TeamStreaks/patchTeamStreakMiddlewares';
import { createTeamMemberMiddlewares } from '../../../RouteMiddlewares/TeamMembers/createTeamMemberMiddlewares';
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

teamStreaksRouter.delete(
    `/:${teamStreakId}/${TeamStreakRouteCategories.members}/:${memberId}`,
    ...deleteTeamMemberMiddlewares,
);

teamStreaksRouter.post(`/`, ...createTeamStreakMiddlewares);

teamStreaksRouter.patch(`/:${teamStreakId}`, ...patchTeamStreakMiddlewares);

teamStreaksRouter.post(`/:${teamStreakId}/${TeamStreakRouteCategories.members}`, ...createTeamMemberMiddlewares);

export { teamStreaksRouter };
