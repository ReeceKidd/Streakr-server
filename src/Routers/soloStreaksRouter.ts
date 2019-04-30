import { Router } from "express";

import { verifyJsonWebTokenMiddlewares } from "../RouteMiddlewares/Utils/verifyJsonWebTokenMiddlewares";
import { getSoloStreaksMiddlewares } from "../RouteMiddlewares/SoloStreak/getSoloStreaksMiddlewares";
import { createSoloStreakMiddlewares } from "../RouteMiddlewares/SoloStreak/createSoloStreakMiddlewares";
import { createSoloStreakTaskMiddlewares } from "../RouteMiddlewares/SoloStreak/createSoloStreakTaskMiddlewares";

export enum SoloStreakProperties {
    task = 'task'
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
    `/:${soloStreakId}/${SoloStreakProperties.task}`, ...createSoloStreakTaskMiddlewares
)

export default soloStreaksRouter;
