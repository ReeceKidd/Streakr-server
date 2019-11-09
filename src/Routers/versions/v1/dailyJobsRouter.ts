import { Router } from 'express';
import { createDailyJobMiddlewares } from '../../../RouteMiddlewares/DailyJobs/createDailyJobMiddlewares';
import { getAllDailyJobsMiddlewares } from '../../../RouteMiddlewares/DailyJobs/getAllDailyJobsMiddlewares';

export const dailyJobId = 'dailyJobId';

const dailyJobsRouter = Router();

dailyJobsRouter.post(`/`, ...createDailyJobMiddlewares);

dailyJobsRouter.get(`/`, ...getAllDailyJobsMiddlewares);

export { dailyJobsRouter };
