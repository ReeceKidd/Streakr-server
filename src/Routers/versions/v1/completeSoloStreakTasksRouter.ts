import { Router } from 'express';
import { getCompleteSoloStreakTasksMiddlewares } from '../../../RouteMiddlewares/CompleteSoloStreakTasks/getCompleteSoloStreakTasksMiddlewares';
import { createCompleteSoloStreakTaskMiddlewares } from '../../../RouteMiddlewares/CompleteSoloStreakTasks/createCompleteSoloStreakTaskMiddlewares';

export const completeSoloStreakTaskId = 'completeSoloStreakTaskId';

const completeSoloStreakTasksRouter = Router();

completeSoloStreakTasksRouter.get(`/`, ...getCompleteSoloStreakTasksMiddlewares);

completeSoloStreakTasksRouter.post(`/`, ...createCompleteSoloStreakTaskMiddlewares);

export { completeSoloStreakTasksRouter };
