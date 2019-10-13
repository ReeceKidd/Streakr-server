import { Router } from 'express';
import { getIncompleteSoloStreakTasksMiddlewares } from '../../../RouteMiddlewares/IncompleteSoloStreakTask/getIncompleteSoloStreakTaskMiddlewares';
import { deleteIncompleteSoloStreakTaskMiddlewares } from '../../../RouteMiddlewares/IncompleteSoloStreakTask/deleteIncompleteSoloStreakTaskMiddlewares';
import { createIncompleteSoloStreakTaskMiddlewares } from '../../../RouteMiddlewares/IncompleteSoloStreakTask/createIncompleteSoloStreakTaskMiddlewares';

export const incompleteSoloStreakTaskId = 'incompleteSoloStreakTaskId';

const incompleteSoloStreakTasksRouter = Router();

incompleteSoloStreakTasksRouter.get(`/`, ...getIncompleteSoloStreakTasksMiddlewares);

incompleteSoloStreakTasksRouter.delete(`/:${incompleteSoloStreakTaskId}`, ...deleteIncompleteSoloStreakTaskMiddlewares);

incompleteSoloStreakTasksRouter.post(`/`, ...createIncompleteSoloStreakTaskMiddlewares);

export { incompleteSoloStreakTasksRouter };
