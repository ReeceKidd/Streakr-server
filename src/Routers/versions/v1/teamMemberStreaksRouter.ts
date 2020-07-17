import { Router } from 'express';

import { createTeamMemberStreakMiddlewares } from '../../../RouteMiddlewares/TeamMemberStreaks/createTeamMemberStreakMiddlewares';
import { getOneTeamMemberStreakMiddlewares } from '../../../RouteMiddlewares/TeamMemberStreaks/getOneTeamMemberStreakMiddlewares';
import { getAllTeamMemberStreaksMiddlewares } from '../../../RouteMiddlewares/TeamMemberStreaks/getAllTeamMemberStreaksMiddlewares';
import { patchTeamMemberStreakMiddlewares } from '../../../RouteMiddlewares/TeamMemberStreaks/patchTeamMemberStreakMiddlewares';
import { authenticationMiddlewares } from '../../../../src/SharedMiddleware/authenticationMiddlewares';
import { recoverTeamMemberStreakMiddlewares } from '../../../RouteMiddlewares/TeamMemberStreaks/recoverTeamMemberStreak';

export const teamMemberStreakId = 'teamMemberStreakId';

const teamMemberStreaksRouter = Router();

teamMemberStreaksRouter.get(`/`, ...getAllTeamMemberStreaksMiddlewares);

teamMemberStreaksRouter.get(`/:${teamMemberStreakId}`, ...getOneTeamMemberStreakMiddlewares);

teamMemberStreaksRouter.use(...authenticationMiddlewares);

teamMemberStreaksRouter.post(`/`, ...createTeamMemberStreakMiddlewares);

teamMemberStreaksRouter.patch(`/:${teamMemberStreakId}`, ...patchTeamMemberStreakMiddlewares);

teamMemberStreaksRouter.post(`/:${teamMemberStreakId}/recover`, ...recoverTeamMemberStreakMiddlewares);

export { teamMemberStreaksRouter };
