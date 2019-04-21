import { Router } from "express";

import { verifyJsonWebTokenMiddlewares } from "../RouteMiddlewares/Utils/verifyJsonWebTokenMiddlewares";
import { getSoloStreaksMiddlewares } from "../RouteMiddlewares/SoloStreak/getSoloStreaksMiddlewares";
import { createSoloStreakMiddlewares } from "../RouteMiddlewares/SoloStreak/createSoloStreakMiddlewares";

export const SoloStreaksPaths = {
    create: "create",
};

const userId = 'userId'

const soloStreaksRouter = Router();

soloStreaksRouter.use('*', ...verifyJsonWebTokenMiddlewares)

soloStreaksRouter.get(
    `/:${userId}`,
    ...getSoloStreaksMiddlewares
);

soloStreaksRouter.post(
    `/${SoloStreaksPaths.create}`,
    ...createSoloStreakMiddlewares
);

export default soloStreaksRouter;
