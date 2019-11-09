import { Router } from 'express';
import { getIncompleteSoloStreakTasksMiddlewares } from '../../../RouteMiddlewares/IncompleteSoloStreakTasks/getIncompleteSoloStreakTaskMiddlewares';
import { createIncompleteSoloStreakTaskMiddlewares } from '../../../RouteMiddlewares/IncompleteSoloStreakTasks/createIncompleteSoloStreakTaskMiddlewares';

export const incompleteSoloStreakTaskId = 'incompleteSoloStreakTaskId';

const incompleteSoloStreakTasksRouter = Router();

incompleteSoloStreakTasksRouter.get(`/`, ...getIncompleteSoloStreakTasksMiddlewares);

incompleteSoloStreakTasksRouter.post(`/`, ...createIncompleteSoloStreakTaskMiddlewares);

export { incompleteSoloStreakTasksRouter };
