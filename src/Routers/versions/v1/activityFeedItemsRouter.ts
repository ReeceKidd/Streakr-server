import { Router } from 'express';
import { getAllActivityFeedItemsMiddlewares } from '../../../RouteMiddlewares/ActivityFeedItems/getAllActivityFeedItemsMiddlewares';
import { createActivityFeedItemMiddlewares } from '../../../../src/RouteMiddlewares/ActivityFeedItems/createActivityFeedItemMiddlewares';

const activityFeedItemsRouter = Router();

activityFeedItemsRouter.get(`/`, ...getAllActivityFeedItemsMiddlewares);

activityFeedItemsRouter.post(`/`, ...createActivityFeedItemMiddlewares);

export { activityFeedItemsRouter };
