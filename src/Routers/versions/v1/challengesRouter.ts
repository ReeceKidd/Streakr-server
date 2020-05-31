import { Router } from 'express';
import { getAllChallengesMiddlewares } from '../../../RouteMiddlewares/Challenges/getAllChallengesMiddlewares';
import { getOneChallengeMiddlewares } from '../../../RouteMiddlewares/Challenges/getOneChallengeMiddlewares';
import { createChallengeMiddlewares } from '../../../RouteMiddlewares/Challenges/createChallengeMiddlewares';

export const challengeId = 'challengeId';

const challengesRouter = Router();

challengesRouter.get(`/`, ...getAllChallengesMiddlewares);

challengesRouter.get(`/:${challengeId}`, ...getOneChallengeMiddlewares);

challengesRouter.post('/', ...createChallengeMiddlewares);

export { challengesRouter };
