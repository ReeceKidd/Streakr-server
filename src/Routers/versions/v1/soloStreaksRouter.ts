import { Router } from 'express';

import { getAllSoloStreaksMiddlewares } from '../../../RouteMiddlewares/SoloStreak/getAllSoloStreaksMiddlewares';
import { createSoloStreakMiddlewares } from '../../../RouteMiddlewares/SoloStreak/createSoloStreakMiddlewares';
import { getOneSoloStreakMiddlewares } from '../../../RouteMiddlewares/SoloStreak/getOneSoloStreakMiddlewares';
import { patchSoloStreakMiddlewares } from '../../../RouteMiddlewares/SoloStreak/patchSoloStreakMiddlewares';

export const soloStreakId = 'soloStreakId';

const soloStreaksRouter = Router();

soloStreaksRouter.get(`/`, ...getAllSoloStreaksMiddlewares);

soloStreaksRouter.get(`/:${soloStreakId}`, ...getOneSoloStreakMiddlewares);

soloStreaksRouter.post(`/`, ...createSoloStreakMiddlewares);

soloStreaksRouter.patch(`/:${soloStreakId}`, ...patchSoloStreakMiddlewares);

export { soloStreaksRouter };
