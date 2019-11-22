import { Router } from 'express';
import { getAllChallengeStreaksMiddlewares } from '../../../RouteMiddlewares/ChallengeStreaks/getAllChallengeStreaksMiddlewares';
import { createChallengeStreakMiddlewares } from '../../../RouteMiddlewares/ChallengeStreaks/createChallengeStreakMiddlewares';
import { getOneChallengeStreakMiddlewares } from '../../../RouteMiddlewares/ChallengeStreaks/getOneChallengeStreakMiddlewares';

export const challengeStreakId = 'challengeStreakId';

const challengeStreaksRouter = Router();

challengeStreaksRouter.get(`/`, ...getAllChallengeStreaksMiddlewares);

challengeStreaksRouter.get(`/:${challengeStreakId}`, ...getOneChallengeStreakMiddlewares);

challengeStreaksRouter.post('/', ...createChallengeStreakMiddlewares);

export { challengeStreaksRouter };
