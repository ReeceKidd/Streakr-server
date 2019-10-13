import { Router } from 'express';
import { getCompleteSoloStreakTasksMiddlewares } from '../../../RouteMiddlewares/CompleteSoloStreakTask/getCompleteSoloStreakTasksMiddlewares';
import { deleteCompleteSoloStreakTaskMiddlewares } from '../../../RouteMiddlewares/CompleteSoloStreakTask/deleteCompleteSoloStreakTaskMiddlewares';
import { createCompleteSoloStreakTaskMiddlewares } from '../../../RouteMiddlewares/CompleteSoloStreakTask/createCompleteSoloStreakTaskMiddlewares';

export const completeSoloStreakTaskId = 'completeSoloStreakTaskId';

const completeSoloStreakTasksRouter = Router();

completeSoloStreakTasksRouter.get(`/`, ...getCompleteSoloStreakTasksMiddlewares);

completeSoloStreakTasksRouter.delete(`/:${completeSoloStreakTaskId}`, ...deleteCompleteSoloStreakTaskMiddlewares);

completeSoloStreakTasksRouter.post(`/`, ...createCompleteSoloStreakTaskMiddlewares);

export { completeSoloStreakTasksRouter };
