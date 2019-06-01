import { Router } from "express";

import { verifyJsonWebTokenMiddlewares } from "../RouteMiddlewares/Utils/verifyJsonWebTokenMiddlewares";
import { getSoloStreaksMiddlewares } from "../RouteMiddlewares/SoloStreak/getSoloStreaksMiddlewares";
import { createSoloStreakMiddlewares } from "../RouteMiddlewares/SoloStreak/createSoloStreakMiddlewares";
import { createSoloStreakCompleteTaskMiddlewares } from "../RouteMiddlewares/SoloStreak/createSoloStreakCompleteTaskMiddlewares";
import { getSoloStreakMiddlewares } from "../RouteMiddlewares/SoloStreak/getSoloStreakMiddlewares";
import { patchSoloStreakMiddlewares } from "../RouteMiddlewares/SoloStreak/patchSoloStreakMiddlewares";
import { deleteSoloStreakMiddlewares } from "../RouteMiddlewares/SoloStreak/deleteSoloStreakMiddlewares";

export enum SoloStreakProperties {
    completeTasks = "complete-tasks"
}

export const soloStreakId = "soloStreakId";

const soloStreaksRouter = Router();

soloStreaksRouter.use("*", ...verifyJsonWebTokenMiddlewares);

soloStreaksRouter.get(
    `/`,
    ...getSoloStreaksMiddlewares
);

soloStreaksRouter.post(
    `/`,
    ...createSoloStreakMiddlewares
);

soloStreaksRouter.get(
    `/:${soloStreakId}`,
    ...getSoloStreakMiddlewares
);

soloStreaksRouter.patch(
    `/:${soloStreakId}`,
    ...patchSoloStreakMiddlewares
);

soloStreaksRouter.delete(
    `/:${soloStreakId}`,
    ...deleteSoloStreakMiddlewares
);

soloStreaksRouter.post(
    `/:${soloStreakId}/${SoloStreakProperties.completeTasks}`, ...createSoloStreakCompleteTaskMiddlewares
);

export default soloStreaksRouter;