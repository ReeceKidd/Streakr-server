import { Router } from 'express';
import { getAllTeamStreaksMiddlewares } from '../../../RouteMiddlewares/TeamStreaks/getAllTeamStreaksMiddlewares';
import { getOneTeamStreakMiddlewares } from '../../../RouteMiddlewares/TeamStreaks/getOneTeamStreakMiddlewares';
import { deleteTeamMemberMiddlewares } from '../../../RouteMiddlewares/TeamMembers/deleteTeamMemberMiddlewares';
import { createTeamStreakMiddlewares } from '../../../RouteMiddlewares/TeamStreaks/createTeamStreakMiddlewares';
import { patchTeamStreakMiddlewares } from '../../../RouteMiddlewares/TeamStreaks/patchTeamStreakMiddlewares';
import { createTeamMemberMiddlewares } from '../../../RouteMiddlewares/TeamMembers/createTeamMemberMiddlewares';
import { authenticationMiddlewares } from '../../../../src/SharedMiddleware/authenticationMiddlewares';
import { getTeamStreakInviteKeyMiddlewares } from '../../../RouteMiddlewares/TeamStreaks/getTeamStreakInviteKeyMiddlewares';
import TeamStreakRouterCategories from '@streakoid/streakoid-models/lib/Types/TeamStreakRouterCategories';

export const teamStreakId = 'teamStreakId';

export const memberId = 'memberId';

const teamStreaksRouter = Router();
teamStreaksRouter.get(`/`, ...getAllTeamStreaksMiddlewares);

teamStreaksRouter.get(`/:${teamStreakId}`, ...getOneTeamStreakMiddlewares);

teamStreaksRouter.use(...authenticationMiddlewares);

teamStreaksRouter.get(
    `/:${teamStreakId}/${TeamStreakRouterCategories.inviteKey}`,
    ...getTeamStreakInviteKeyMiddlewares,
);

teamStreaksRouter.delete(
    `/:${teamStreakId}/${TeamStreakRouterCategories.members}/:${memberId}`,
    ...deleteTeamMemberMiddlewares,
);

teamStreaksRouter.post(`/`, ...createTeamStreakMiddlewares);

teamStreaksRouter.patch(`/:${teamStreakId}`, ...patchTeamStreakMiddlewares);

teamStreaksRouter.post(`/:${teamStreakId}/${TeamStreakRouterCategories.members}`, ...createTeamMemberMiddlewares);

export { teamStreaksRouter };
