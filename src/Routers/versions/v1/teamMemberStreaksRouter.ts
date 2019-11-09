import { Router } from 'express';

import { createTeamMemberStreakMiddlewares } from '../../../RouteMiddlewares/TeamMemberStreaks/createTeamMemberStreakMiddlewares';
import { getOneTeamMemberStreakMiddlewares } from '../../../RouteMiddlewares/TeamMemberStreaks/getOneTeamMemberStreakMiddlewares';
import { getAllTeamMemberStreaksMiddlewares } from '../../../RouteMiddlewares/TeamMemberStreaks/getAllTeamMemberStreaksMiddlewares';
import { patchTeamMemberStreakMiddlewares } from '../../../RouteMiddlewares/TeamMemberStreaks/patchTeamMemberStreakMiddlewares';

export const teamMemberStreakId = 'teamMemberStreakId';

const teamMemberStreaksRouter = Router();

teamMemberStreaksRouter.get(`/`, ...getAllTeamMemberStreaksMiddlewares);

teamMemberStreaksRouter.get(`/:${teamMemberStreakId}`, ...getOneTeamMemberStreakMiddlewares);

teamMemberStreaksRouter.post(`/`, ...createTeamMemberStreakMiddlewares);

teamMemberStreaksRouter.patch(`/:${teamMemberStreakId}`, ...patchTeamMemberStreakMiddlewares);

export { teamMemberStreaksRouter };
