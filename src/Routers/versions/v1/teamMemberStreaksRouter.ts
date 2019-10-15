import { Router } from 'express';

import { createTeamMemberStreakMiddlewares } from '../../../RouteMiddlewares/TeamMemberStreak/createTeamMemberStreakMiddlewares';
import { deleteTeamMemberStreakMiddlewares } from '../../../RouteMiddlewares/TeamMemberStreak/deleteTeamMemberStreakMiddlewares';
import { getOneTeamMemberStreakMiddlewares } from '../../../RouteMiddlewares/TeamMemberStreak/getOneTeamMemberStreakMiddlewares';
import { getAllTeamMemberStreaksMiddlewares } from '../../../RouteMiddlewares/TeamMemberStreak/getAllTeamMemberStreaksMiddlewares';
import { patchTeamMemberStreakMiddlewares } from '../../../RouteMiddlewares/TeamMemberStreak/patchTeamMemberStreakMiddlewares';

export const teamMemberStreakId = 'teamMemberStreakId';

const teamMemberStreaksRouter = Router();

teamMemberStreaksRouter.get(`/`, ...getAllTeamMemberStreaksMiddlewares);

teamMemberStreaksRouter.get(`/:${teamMemberStreakId}`, ...getOneTeamMemberStreakMiddlewares);

teamMemberStreaksRouter.delete(`/:${teamMemberStreakId}`, ...deleteTeamMemberStreakMiddlewares);

teamMemberStreaksRouter.post(`/`, ...createTeamMemberStreakMiddlewares);

teamMemberStreaksRouter.patch(`/:${teamMemberStreakId}`, ...patchTeamMemberStreakMiddlewares);

export { teamMemberStreaksRouter };
