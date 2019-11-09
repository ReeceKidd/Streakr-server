import { Router } from 'express';
import { createCompleteTeamMemberStreakTaskMiddlewares } from '../../../RouteMiddlewares/CompleteTeamMemberStreakTasks/createCompleteTeamMemberStreakTaskMiddlewares';
import { getCompleteTeamMemberStreakTasksMiddlewares } from '../../../RouteMiddlewares/CompleteTeamMemberStreakTasks/getCompleteTeamMemberStreakTasksMiddlewares';

export const completeTeamMemberStreakTaskId = 'completeTeamMemberStreakTaskId';

const completeTeamMemberStreakTasksRouter = Router();

completeTeamMemberStreakTasksRouter.get(`/`, ...getCompleteTeamMemberStreakTasksMiddlewares);

completeTeamMemberStreakTasksRouter.post(`/`, ...createCompleteTeamMemberStreakTaskMiddlewares);

export { completeTeamMemberStreakTasksRouter };
