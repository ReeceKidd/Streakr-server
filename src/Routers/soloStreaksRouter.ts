import { Router } from "express";

import { verifyJsonWebTokenMiddlewares } from "../RouteMiddlewares/Utils/verifyJsonWebTokenMiddlewares";
import { getSoloStreaksMiddlewares } from "../RouteMiddlewares/SoloStreak/getSoloStreaksMiddlewares";

export const SoloStreaksPaths = {
    get: "",
};

const userId = 'userId'

const soloStreaksRouter = Router();

soloStreaksRouter.use('*', ...verifyJsonWebTokenMiddlewares)

soloStreaksRouter.get(
    `/:${userId}`,
    ...getSoloStreaksMiddlewares
);

export default soloStreaksRouter;
