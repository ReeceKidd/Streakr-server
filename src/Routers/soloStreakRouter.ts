import { Router } from "express";

import { createSoloStreakMiddlewares } from "../Routes/SoloStreak/createSoloStreakMiddlewares";

const soloStreakPaths = {
    create: "create",
};

const soloStreakRouter = Router();

soloStreakRouter.post(
    `/${soloStreakPaths.create}`,
    ...createSoloStreakMiddlewares
);

export default soloStreakRouter;
