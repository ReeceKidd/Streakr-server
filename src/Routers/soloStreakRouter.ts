import { Router } from "express";

import { createSoloStreakMiddlewares } from "../RouteMiddlewares/SoloStreak/createSoloStreakMiddlewares";

const soloStreakPaths = {
    create: "create",
};

const soloStreakRouter = Router();

soloStreakRouter.post(
    `/${soloStreakPaths.create}`,
    ...createSoloStreakMiddlewares
);

export default soloStreakRouter;
