import { Router } from "express";
import { createStreakTrackingEventMiddlewares } from "../../../RouteMiddlewares/StreakTrackingEvent/createStreakTrackingEventMiddleware";
import { getStreakTrackingEventMiddlewares } from "../../../RouteMiddlewares/StreakTrackingEvent/getStreakTrackingEventMiddlewares";
import { getStreakTrackingEventsMiddlewares } from "../../../RouteMiddlewares/StreakTrackingEvent/getStreakTrackingEventsMiddlewares";
import { deleteStreakTrackingEventMiddlewares } from "../../../RouteMiddlewares/StreakTrackingEvent/deleteStreakTrackingEventMiddlewares";

const streakTrackingEventRouter = Router();

const streakTrackingEventId = "streakTrackingEventId";

streakTrackingEventRouter.get(`/`, ...getStreakTrackingEventsMiddlewares);

streakTrackingEventRouter.get(
  `/:${streakTrackingEventId}`,
  ...getStreakTrackingEventMiddlewares
);

streakTrackingEventRouter.post(`/`, ...createStreakTrackingEventMiddlewares);

streakTrackingEventRouter.delete(
  `/:${streakTrackingEventId}`,
  ...deleteStreakTrackingEventMiddlewares
);

export default streakTrackingEventRouter;
