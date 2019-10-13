import { Router } from 'express';
import { createCompleteGroupMemberStreakTaskMiddlewares } from '../../../RouteMiddlewares/CompleteGroupMemberStreakTask/createCompleteGroupMemberStreakTaskMiddlewares';
import { deleteCompleteGroupMemberStreakTaskMiddlewares } from '../../../RouteMiddlewares/CompleteGroupMemberStreakTask/deleteGroupMemberStreakTaskMiddlewares';
import { getCompleteGroupMemberStreakTasksMiddlewares } from '../../../RouteMiddlewares/CompleteGroupMemberStreakTask/getCompleteGroupMemberStreakTasksMiddlewares';

export const completeGroupMemberStreakTaskId = 'completeGroupMemberStreakTaskId';

const completeGroupMemberStreakTasksRouter = Router();

completeGroupMemberStreakTasksRouter.get(`/`, ...getCompleteGroupMemberStreakTasksMiddlewares);

completeGroupMemberStreakTasksRouter.delete(
    `/:${completeGroupMemberStreakTaskId}`,
    ...deleteCompleteGroupMemberStreakTaskMiddlewares,
);

completeGroupMemberStreakTasksRouter.post(`/`, ...createCompleteGroupMemberStreakTaskMiddlewares);

export { completeGroupMemberStreakTasksRouter };
