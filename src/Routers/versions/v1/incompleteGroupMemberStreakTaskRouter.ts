import { Router } from 'express';
import { getIncompleteGroupMemberStreakTasksMiddlewares } from '../../../RouteMiddlewares/IncompleteGroupMemberStreakTask/getIncompleteGroupMemberStreakTaskMiddlewares';
import { deleteIncompleteGroupMemberStreakTaskMiddlewares } from '../../../RouteMiddlewares/IncompleteGroupMemberStreakTask/deleteIncompleteGroupMemberStreakTaskMiddlewares';
import { createIncompleteGroupMemberStreakTaskMiddlewares } from '../../../RouteMiddlewares/IncompleteGroupMemberStreakTask/createIncompleteGroupMemberStreakTaskMiddlewares';

export const incompleteGroupMemberStreakTaskId = 'incompleteGroupMemberStreakTaskId';

const incompleteGroupMemberStreakTasksRouter = Router();

incompleteGroupMemberStreakTasksRouter.get(`/`, ...getIncompleteGroupMemberStreakTasksMiddlewares);

incompleteGroupMemberStreakTasksRouter.delete(
    `/:${incompleteGroupMemberStreakTaskId}`,
    ...deleteIncompleteGroupMemberStreakTaskMiddlewares,
);

incompleteGroupMemberStreakTasksRouter.post(`/`, ...createIncompleteGroupMemberStreakTaskMiddlewares);

export { incompleteGroupMemberStreakTasksRouter };
