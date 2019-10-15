import { Router } from 'express';
import { getIncompleteTeamMemberStreakTasksMiddlewares } from '../../../RouteMiddlewares/IncompleteTeamMemberStreakTask/getIncompleteTeamMemberStreakTaskMiddlewares';
import { deleteIncompleteTeamMemberStreakTaskMiddlewares } from '../../../RouteMiddlewares/IncompleteTeamMemberStreakTask/deleteIncompleteTeamMemberStreakTaskMiddlewares';
import { createIncompleteTeamMemberStreakTaskMiddlewares } from '../../../RouteMiddlewares/IncompleteTeamMemberStreakTask/createIncompleteTeamMemberStreakTaskMiddlewares';

export const incompleteTeamMemberStreakTaskId = 'incompleteTeamMemberStreakTaskId';

const incompleteTeamMemberStreakTasksRouter = Router();

incompleteTeamMemberStreakTasksRouter.get(`/`, ...getIncompleteTeamMemberStreakTasksMiddlewares);

incompleteTeamMemberStreakTasksRouter.delete(
    `/:${incompleteTeamMemberStreakTaskId}`,
    ...deleteIncompleteTeamMemberStreakTaskMiddlewares,
);

incompleteTeamMemberStreakTasksRouter.post(`/`, ...createIncompleteTeamMemberStreakTaskMiddlewares);

export { incompleteTeamMemberStreakTasksRouter };
