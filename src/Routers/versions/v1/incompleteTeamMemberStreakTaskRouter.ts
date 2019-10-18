import { Router } from 'express';
import { getIncompleteTeamMemberStreakTasksMiddlewares } from '../../../RouteMiddlewares/IncompleteTeamMemberStreakTask/getIncompleteTeamMemberStreakTaskMiddlewares';
import { createIncompleteTeamMemberStreakTaskMiddlewares } from '../../../RouteMiddlewares/IncompleteTeamMemberStreakTask/createIncompleteTeamMemberStreakTaskMiddlewares';

export const incompleteTeamMemberStreakTaskId = 'incompleteTeamMemberStreakTaskId';

const incompleteTeamMemberStreakTasksRouter = Router();

incompleteTeamMemberStreakTasksRouter.get(`/`, ...getIncompleteTeamMemberStreakTasksMiddlewares);

incompleteTeamMemberStreakTasksRouter.post(`/`, ...createIncompleteTeamMemberStreakTaskMiddlewares);

export { incompleteTeamMemberStreakTasksRouter };
