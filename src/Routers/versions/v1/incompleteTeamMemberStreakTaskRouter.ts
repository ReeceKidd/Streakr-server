import { Router } from 'express';
import { getIncompleteTeamMemberStreakTasksMiddlewares } from '../../../RouteMiddlewares/IncompleteTeamMemberStreakTasks/getIncompleteTeamMemberStreakTaskMiddlewares';
import { createIncompleteTeamMemberStreakTaskMiddlewares } from '../../../RouteMiddlewares/IncompleteTeamMemberStreakTasks/createIncompleteTeamMemberStreakTaskMiddlewares';

export const incompleteTeamMemberStreakTaskId = 'incompleteTeamMemberStreakTaskId';

const incompleteTeamMemberStreakTasksRouter = Router();

incompleteTeamMemberStreakTasksRouter.get(`/`, ...getIncompleteTeamMemberStreakTasksMiddlewares);

incompleteTeamMemberStreakTasksRouter.post(`/`, ...createIncompleteTeamMemberStreakTaskMiddlewares);

export { incompleteTeamMemberStreakTasksRouter };
