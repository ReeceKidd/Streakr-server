import { Router } from 'express';
import { createStreakTrackingEventMiddlewares } from '../../../RouteMiddlewares/StreakTrackingEvents/createStreakTrackingEventMiddleware';
import { getStreakTrackingEventMiddlewares } from '../../../RouteMiddlewares/StreakTrackingEvents/getStreakTrackingEventMiddlewares';
import { getAllStreakTrackingEventsMiddlewares } from '../../../RouteMiddlewares/StreakTrackingEvents/getAllStreakTrackingEventsMiddlewares';

const streakTrackingEventRouter = Router();

const streakTrackingEventId = 'streakTrackingEventId';

streakTrackingEventRouter.get(`/`, ...getAllStreakTrackingEventsMiddlewares);

streakTrackingEventRouter.get(`/:${streakTrackingEventId}`, ...getStreakTrackingEventMiddlewares);

streakTrackingEventRouter.post(`/`, ...createStreakTrackingEventMiddlewares);

export { streakTrackingEventRouter };
