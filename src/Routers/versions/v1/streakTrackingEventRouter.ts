import { Router } from 'express';
import { createStreakTrackingEventMiddlewares } from '../../../RouteMiddlewares/StreakTrackingEvent/createStreakTrackingEventMiddleware';
import { getStreakTrackingEventMiddlewares } from '../../../RouteMiddlewares/StreakTrackingEvent/getStreakTrackingEventMiddlewares';
import { getAllStreakTrackingEventsMiddlewares } from '../../../RouteMiddlewares/StreakTrackingEvent/getAllStreakTrackingEventsMiddlewares';
import { deleteStreakTrackingEventMiddlewares } from '../../../RouteMiddlewares/StreakTrackingEvent/deleteStreakTrackingEventMiddlewares';

const streakTrackingEventRouter = Router();

const streakTrackingEventId = 'streakTrackingEventId';

streakTrackingEventRouter.get(`/`, ...getAllStreakTrackingEventsMiddlewares);

streakTrackingEventRouter.get(`/:${streakTrackingEventId}`, ...getStreakTrackingEventMiddlewares);

streakTrackingEventRouter.post(`/`, ...createStreakTrackingEventMiddlewares);

streakTrackingEventRouter.delete(`/:${streakTrackingEventId}`, ...deleteStreakTrackingEventMiddlewares);

export { streakTrackingEventRouter };
