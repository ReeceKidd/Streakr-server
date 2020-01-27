import { Router } from 'express';
import { getAllActivityFeedItemsMiddlewares } from '../../../RouteMiddlewares/ActivityFeedItems/getAllActivityFeedItemsMiddlewares';

const activityFeedItemsRouter = Router();

activityFeedItemsRouter.get(`/`, ...getAllActivityFeedItemsMiddlewares);

export { activityFeedItemsRouter };
