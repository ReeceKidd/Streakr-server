import { Router } from 'express';

import { getAllSoloStreaksMiddlewares } from '../../../RouteMiddlewares/SoloStreaks/getAllSoloStreaksMiddlewares';
import { createSoloStreakMiddlewares } from '../../../RouteMiddlewares/SoloStreaks/createSoloStreakMiddlewares';
import { getOneSoloStreakMiddlewares } from '../../../RouteMiddlewares/SoloStreaks/getOneSoloStreakMiddlewares';
import { authenticationMiddlewares } from '../../../../src/SharedMiddleware/authenticationMiddlewares';
import { recoverSoloStreakMiddlewares } from '../../../RouteMiddlewares/SoloStreaks/recoverSoloStreakMiddlewares';
import { patchSoloStreakMiddlewares } from '../../../RouteMiddlewares/SoloStreaks/patchSoloStreakMiddlewares';

export const soloStreakId = 'soloStreakId';

const soloStreaksRouter = Router();

soloStreaksRouter.get(`/`, ...getAllSoloStreaksMiddlewares);

soloStreaksRouter.get(`/:${soloStreakId}`, ...getOneSoloStreakMiddlewares);

soloStreaksRouter.use(...authenticationMiddlewares);

soloStreaksRouter.post(`/`, ...createSoloStreakMiddlewares);

soloStreaksRouter.patch(`/:${soloStreakId}`, ...patchSoloStreakMiddlewares);

soloStreaksRouter.patch(`/:${soloStreakId}/recover`, ...recoverSoloStreakMiddlewares);

export { soloStreaksRouter };
