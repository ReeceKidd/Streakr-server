import { Router } from "express";

import { createSoloStreakMiddlewares } from "../RouteMiddlewares/SoloStreak/createSoloStreakMiddlewares";
import { verifyJsonWebTokenMiddlewares } from "../RouteMiddlewares/Utils/verifyJsonWebTokenMiddlewares";

export const SoloStreakPaths = {
    create: "create",
};

const soloStreakRouter = Router();

soloStreakRouter.use('*', ...verifyJsonWebTokenMiddlewares)

soloStreakRouter.post(
    `/${SoloStreakPaths.create}`,
    ...createSoloStreakMiddlewares
);

export default soloStreakRouter;
