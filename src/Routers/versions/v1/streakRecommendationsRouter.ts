import { Router } from 'express';

import { getAllStreakRecommendationsMiddlewares } from '../../../../src/RouteMiddlewares/StreakRecommendations/getAllStreakRecommendationsMiddlewares';

const streakRecommendationsRouter = Router();

streakRecommendationsRouter.get(`/`, ...getAllStreakRecommendationsMiddlewares);

export { streakRecommendationsRouter };
