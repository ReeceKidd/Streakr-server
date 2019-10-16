import { Router } from 'express';
import { createDailyJobMiddlewares } from '../../../RouteMiddlewares/DailyJob/createDailyJobMiddlewares';
import { getAllDailyJobsMiddlewares } from '../../../RouteMiddlewares/DailyJob/getAllDailyJobsMiddlewares';

export const dailyJobId = 'dailyJobId';

const dailyJobsRouter = Router();

dailyJobsRouter.post(`/`, ...createDailyJobMiddlewares);

dailyJobsRouter.get(`/`, ...getAllDailyJobsMiddlewares);

export { dailyJobsRouter };
