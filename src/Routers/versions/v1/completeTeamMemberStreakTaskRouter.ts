import { Router } from 'express';
import { createCompleteTeamMemberStreakTaskMiddlewares } from '../../../RouteMiddlewares/CompleteTeamMemberStreakTask/createCompleteTeamMemberStreakTaskMiddlewares';
import { getCompleteTeamMemberStreakTasksMiddlewares } from '../../../RouteMiddlewares/CompleteTeamMemberStreakTask/getCompleteTeamMemberStreakTasksMiddlewares';

export const completeTeamMemberStreakTaskId = 'completeTeamMemberStreakTaskId';

const completeTeamMemberStreakTasksRouter = Router();

completeTeamMemberStreakTasksRouter.get(`/`, ...getCompleteTeamMemberStreakTasksMiddlewares);

completeTeamMemberStreakTasksRouter.post(`/`, ...createCompleteTeamMemberStreakTaskMiddlewares);

export { completeTeamMemberStreakTasksRouter };
