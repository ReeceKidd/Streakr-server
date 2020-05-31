import { Router } from 'express';
import { getAllChallengeStreaksMiddlewares } from '../../../RouteMiddlewares/ChallengeStreaks/getAllChallengeStreaksMiddlewares';
import { createChallengeStreakMiddlewares } from '../../../RouteMiddlewares/ChallengeStreaks/createChallengeStreakMiddlewares';
import { getOneChallengeStreakMiddlewares } from '../../../RouteMiddlewares/ChallengeStreaks/getOneChallengeStreakMiddlewares';
import { patchChallengeStreakMiddlewares } from '../../../RouteMiddlewares/ChallengeStreaks/patchChallengeStreakMiddlewares';
import { authenticationMiddlewares } from '../../../../src/SharedMiddleware/authenticationMiddlewares';

export const challengeStreakId = 'challengeStreakId';

const challengeStreaksRouter = Router();

challengeStreaksRouter.get(`/`, ...getAllChallengeStreaksMiddlewares);

challengeStreaksRouter.get(`/:${challengeStreakId}`, ...getOneChallengeStreakMiddlewares);

challengeStreaksRouter.use(...authenticationMiddlewares);

challengeStreaksRouter.post('/', ...createChallengeStreakMiddlewares);

challengeStreaksRouter.patch(`/:${challengeStreakId}`, ...patchChallengeStreakMiddlewares);

export { challengeStreaksRouter };
