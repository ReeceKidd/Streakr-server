import { Router } from 'express';
import { getCompleteSoloStreakTasksMiddlewares } from '../../../RouteMiddlewares/CompleteSoloStreakTasks/getCompleteSoloStreakTasksMiddlewares';
import { createCompleteSoloStreakTaskMiddlewares } from '../../../RouteMiddlewares/CompleteSoloStreakTasks/createCompleteSoloStreakTaskMiddlewares';
import { authenticationMiddlewares } from '../../../../src/SharedMiddleware/authenticationMiddlewares';

export const completeSoloStreakTaskId = 'completeSoloStreakTaskId';

const completeSoloStreakTasksRouter = Router();

completeSoloStreakTasksRouter.get(`/`, ...getCompleteSoloStreakTasksMiddlewares);

completeSoloStreakTasksRouter.use(...authenticationMiddlewares);

completeSoloStreakTasksRouter.post(`/`, ...createCompleteSoloStreakTaskMiddlewares);

export { completeSoloStreakTasksRouter };
