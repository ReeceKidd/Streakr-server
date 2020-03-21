import { Router } from 'express';
import { getIncompleteSoloStreakTasksMiddlewares } from '../../../RouteMiddlewares/IncompleteSoloStreakTasks/getIncompleteSoloStreakTaskMiddlewares';
import { createIncompleteSoloStreakTaskMiddlewares } from '../../../RouteMiddlewares/IncompleteSoloStreakTasks/createIncompleteSoloStreakTaskMiddlewares';
import { authenticationMiddlewares } from '../../../../src/SharedMiddleware/authenticationMiddlewares';

export const incompleteSoloStreakTaskId = 'incompleteSoloStreakTaskId';

const incompleteSoloStreakTasksRouter = Router();

incompleteSoloStreakTasksRouter.get(`/`, ...getIncompleteSoloStreakTasksMiddlewares);

incompleteSoloStreakTasksRouter.use(...authenticationMiddlewares);

incompleteSoloStreakTasksRouter.post(`/`, ...createIncompleteSoloStreakTaskMiddlewares);

export { incompleteSoloStreakTasksRouter };
