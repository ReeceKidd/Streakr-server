import { Router } from "express";
import { createStreakTrackingEventMiddlewares } from "../../../RouteMiddlewares/StreakTrackingEvent/createStreakTrackingEventMiddleware";

const streakTrackingEventRouter = Router();

streakTrackingEventRouter.post(`/`, ...createStreakTrackingEventMiddlewares);

export default streakTrackingEventRouter;
