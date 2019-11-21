import { Router } from 'express';
import { getAllChallengesMiddlewares } from '../../../RouteMiddlewares/Challenges/getAllChallengesMiddlewares';
import { createChallengeMiddlewares } from '../../../RouteMiddlewares/Challenges/createChallengeMiddlewares';

export const challengeId = 'challengeId';

const challengesRouter = Router();

challengesRouter.get(`/`, ...getAllChallengesMiddlewares);

challengesRouter.post('/', ...createChallengeMiddlewares);

export { challengesRouter };
