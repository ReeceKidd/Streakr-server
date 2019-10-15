import { Router } from 'express';
import { createCompleteTeamMemberStreakTaskMiddlewares } from '../../../RouteMiddlewares/CompleteTeamMemberStreakTask/createCompleteTeamMemberStreakTaskMiddlewares';
import { deleteCompleteTeamMemberStreakTaskMiddlewares } from '../../../RouteMiddlewares/CompleteTeamMemberStreakTask/deleteTeamMemberStreakTaskMiddlewares';
import { getCompleteTeamMemberStreakTasksMiddlewares } from '../../../RouteMiddlewares/CompleteTeamMemberStreakTask/getCompleteTeamMemberStreakTasksMiddlewares';

export const completeTeamMemberStreakTaskId = 'completeTeamMemberStreakTaskId';

const completeTeamMemberStreakTasksRouter = Router();

completeTeamMemberStreakTasksRouter.get(`/`, ...getCompleteTeamMemberStreakTasksMiddlewares);

completeTeamMemberStreakTasksRouter.delete(
    `/:${completeTeamMemberStreakTaskId}`,
    ...deleteCompleteTeamMemberStreakTaskMiddlewares,
);

completeTeamMemberStreakTasksRouter.post(`/`, ...createCompleteTeamMemberStreakTaskMiddlewares);

export { completeTeamMemberStreakTasksRouter };
