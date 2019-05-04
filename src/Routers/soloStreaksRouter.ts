import { Router } from "express";

import { verifyJsonWebTokenMiddlewares } from "../RouteMiddlewares/Utils/verifyJsonWebTokenMiddlewares";
import { getSoloStreaksMiddlewares } from "../RouteMiddlewares/SoloStreak/getSoloStreaksMiddlewares";
import { createSoloStreakMiddlewares } from "../RouteMiddlewares/SoloStreak/createSoloStreakMiddlewares";
import { createSoloStreakCompleteTaskMiddlewares } from "../RouteMiddlewares/SoloStreak/createSoloStreakCompleteTaskMiddlewares";

export enum SoloStreakProperties {
    completeTasks = 'complete-tasks'
}

export const soloStreakId = 'soloStreakId'

const soloStreaksRouter = Router();

soloStreaksRouter.use('*', ...verifyJsonWebTokenMiddlewares)

soloStreaksRouter.get(
    `/`,
    ...getSoloStreaksMiddlewares
);

soloStreaksRouter.post(
    `/`,
    ...createSoloStreakMiddlewares
);

soloStreaksRouter.post(
    `/:${soloStreakId}/${SoloStreakProperties.completeTasks}`, ...createSoloStreakCompleteTaskMiddlewares
)

export default soloStreaksRouter;