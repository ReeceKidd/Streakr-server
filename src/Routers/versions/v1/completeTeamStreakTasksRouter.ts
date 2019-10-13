import { Router } from 'express';
import { getCompleteTeamStreakTasksMiddlewares } from '../../../RouteMiddlewares/CompleteTeamStreakTask/getCompleteTeamStreakTasksMiddlewares';
import { deleteCompleteTeamStreakTaskMiddlewares } from '../../../RouteMiddlewares/CompleteTeamStreakTask/deleteCompleteTeamStreakTasksMiddlewares';
import { createCompleteTeamStreakTaskMiddlewares } from '../../../RouteMiddlewares/CompleteTeamStreakTask/createCompleteTeamStreakTaskMiddlewares';

export const completeTeamStreakTaskId = 'completeTeamStreakTaskId';

const completeTeamStreakTasksRouter = Router();

completeTeamStreakTasksRouter.get(`/`, ...getCompleteTeamStreakTasksMiddlewares);

completeTeamStreakTasksRouter.delete(`/:${completeTeamStreakTaskId}`, ...deleteCompleteTeamStreakTaskMiddlewares);

completeTeamStreakTasksRouter.post(`/`, ...createCompleteTeamStreakTaskMiddlewares);

export { completeTeamStreakTasksRouter };
