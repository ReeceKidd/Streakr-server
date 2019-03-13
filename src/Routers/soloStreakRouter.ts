import { Router } from "express";

import { createSoloStreakMiddlewares } from "../RouteMiddlewares/SoloStreak/createSoloStreakMiddlewares";
import { verifyJsonWebTokenMiddlewares } from "../RouteMiddlewares/Utils/verifyJsonWebTokenMiddlewares";

const soloStreakPaths = {
    create: "create",
};

const soloStreakRouter = Router();

soloStreakRouter.use('*', ...verifyJsonWebTokenMiddlewares)

soloStreakRouter.post(
    `/${soloStreakPaths.create}`,
    ...createSoloStreakMiddlewares
);

export default soloStreakRouter;
