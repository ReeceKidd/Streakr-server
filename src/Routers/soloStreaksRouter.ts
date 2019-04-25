import { Router } from "express";

import { verifyJsonWebTokenMiddlewares } from "../RouteMiddlewares/Utils/verifyJsonWebTokenMiddlewares";
import { getSoloStreaksMiddlewares } from "../RouteMiddlewares/SoloStreak/getSoloStreaksMiddlewares";
import { createSoloStreakMiddlewares } from "../RouteMiddlewares/SoloStreak/createSoloStreakMiddlewares";

export enum SoloStreakProperties {
    id = 'id'
}

const soloStreaksRouter = Router();

soloStreaksRouter.use('*', ...verifyJsonWebTokenMiddlewares)

soloStreaksRouter.get(
    `/`,
    ...getSoloStreaksMiddlewares
);

// soloStreaksRouter.get(
//     `/:${id}`
// )

soloStreaksRouter.post(
    `/`,
    ...createSoloStreakMiddlewares
);

export default soloStreaksRouter;
