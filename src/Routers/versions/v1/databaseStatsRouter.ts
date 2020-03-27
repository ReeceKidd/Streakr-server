import { Router } from 'express';
import { getDatabaseStatsMiddlewares } from '../../../../src/RouteMiddlewares/DatabaseStats/getDatabaseStatsMiddlewares';

const databaseStatsRouter = Router();

databaseStatsRouter.get(`/`, ...getDatabaseStatsMiddlewares);

export { databaseStatsRouter };
