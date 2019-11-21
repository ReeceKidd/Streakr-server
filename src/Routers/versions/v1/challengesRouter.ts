import { Router } from 'express';
import { getAllChallengesMiddlewares } from '../../../RouteMiddlewares/Challenges/getAllChallengesMiddlewares';
import { createChallengeMiddlewares } from '../../../RouteMiddlewares/Challenges/createChallengeMiddlewares';
import { getOneChallengeMiddlewares } from '../../../RouteMiddlewares/Challenges/getOneChallengeMiddlewares';

export const challengeId = 'challengeId';

const challengesRouter = Router();

challengesRouter.get(`/`, ...getAllChallengesMiddlewares);

challengesRouter.get(`/:${challengeId}`, ...getOneChallengeMiddlewares);

challengesRouter.post('/', ...createChallengeMiddlewares);

export { challengesRouter };
