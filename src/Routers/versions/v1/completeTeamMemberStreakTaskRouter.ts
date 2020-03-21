import { Router } from 'express';
import { createCompleteTeamMemberStreakTaskMiddlewares } from '../../../RouteMiddlewares/CompleteTeamMemberStreakTasks/createCompleteTeamMemberStreakTaskMiddlewares';
import { getCompleteTeamMemberStreakTasksMiddlewares } from '../../../RouteMiddlewares/CompleteTeamMemberStreakTasks/getCompleteTeamMemberStreakTasksMiddlewares';
import { authenticationMiddlewares } from '../../../../src/SharedMiddleware/authenticationMiddlewares';

export const completeTeamMemberStreakTaskId = 'completeTeamMemberStreakTaskId';

const completeTeamMemberStreakTasksRouter = Router();

completeTeamMemberStreakTasksRouter.get(`/`, ...getCompleteTeamMemberStreakTasksMiddlewares);

completeTeamMemberStreakTasksRouter.use(...authenticationMiddlewares);

completeTeamMemberStreakTasksRouter.post(`/`, ...createCompleteTeamMemberStreakTaskMiddlewares);

export { completeTeamMemberStreakTasksRouter };
