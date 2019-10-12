import { Router } from 'express';
import { createDailyJobMiddlewares } from '../../../RouteMiddlewares/DailyJob/createDailyJobMiddlewares';

export const dailyJobId = 'dailyJobId';

const dailyJobsRouter = Router();

dailyJobsRouter.post(`/`, ...createDailyJobMiddlewares);

export default dailyJobsRouter;
