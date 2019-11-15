import { Router } from 'express';

import { getAllStreakRecommendationsMiddlewares } from '../../../../src/RouteMiddlewares/StreakRecommendations/getAllStreakRecommendationsMiddlewares';
import { createStreakRecommendationMiddlewares } from '../../../../src/RouteMiddlewares/StreakRecommendations/createStreakRecommendationMiddlewares';

const streakRecommendationsRouter = Router();

streakRecommendationsRouter.get(`/`, ...getAllStreakRecommendationsMiddlewares);

streakRecommendationsRouter.post(`/`, ...createStreakRecommendationMiddlewares);

export { streakRecommendationsRouter };
