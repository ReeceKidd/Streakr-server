import { Router } from 'express';
import { getIncompleteTeamMemberStreakTasksMiddlewares } from '../../../RouteMiddlewares/IncompleteTeamMemberStreakTasks/getIncompleteTeamMemberStreakTaskMiddlewares';
import { createIncompleteTeamMemberStreakTaskMiddlewares } from '../../../RouteMiddlewares/IncompleteTeamMemberStreakTasks/createIncompleteTeamMemberStreakTaskMiddlewares';
import { authenticationMiddlewares } from '../../../../src/SharedMiddleware/authenticationMiddlewares';

export const incompleteTeamMemberStreakTaskId = 'incompleteTeamMemberStreakTaskId';

const incompleteTeamMemberStreakTasksRouter = Router();

incompleteTeamMemberStreakTasksRouter.get(`/`, ...getIncompleteTeamMemberStreakTasksMiddlewares);

incompleteTeamMemberStreakTasksRouter.use(...authenticationMiddlewares);

incompleteTeamMemberStreakTasksRouter.post(`/`, ...createIncompleteTeamMemberStreakTaskMiddlewares);

export { incompleteTeamMemberStreakTasksRouter };
