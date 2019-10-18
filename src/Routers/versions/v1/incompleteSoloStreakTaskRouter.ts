import { Router } from 'express';
import { getIncompleteSoloStreakTasksMiddlewares } from '../../../RouteMiddlewares/IncompleteSoloStreakTask/getIncompleteSoloStreakTaskMiddlewares';
import { createIncompleteSoloStreakTaskMiddlewares } from '../../../RouteMiddlewares/IncompleteSoloStreakTask/createIncompleteSoloStreakTaskMiddlewares';

export const incompleteSoloStreakTaskId = 'incompleteSoloStreakTaskId';

const incompleteSoloStreakTasksRouter = Router();

incompleteSoloStreakTasksRouter.get(`/`, ...getIncompleteSoloStreakTasksMiddlewares);

incompleteSoloStreakTasksRouter.post(`/`, ...createIncompleteSoloStreakTaskMiddlewares);

export { incompleteSoloStreakTasksRouter };
