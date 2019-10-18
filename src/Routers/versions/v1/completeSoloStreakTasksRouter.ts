import { Router } from 'express';
import { getCompleteSoloStreakTasksMiddlewares } from '../../../RouteMiddlewares/CompleteSoloStreakTask/getCompleteSoloStreakTasksMiddlewares';
import { createCompleteSoloStreakTaskMiddlewares } from '../../../RouteMiddlewares/CompleteSoloStreakTask/createCompleteSoloStreakTaskMiddlewares';

export const completeSoloStreakTaskId = 'completeSoloStreakTaskId';

const completeSoloStreakTasksRouter = Router();

completeSoloStreakTasksRouter.get(`/`, ...getCompleteSoloStreakTasksMiddlewares);

completeSoloStreakTasksRouter.post(`/`, ...createCompleteSoloStreakTaskMiddlewares);

export { completeSoloStreakTasksRouter };
