import { Router } from 'express';
import { createCompleteChallengeStreakTaskMiddlewares } from '../../../../src/RouteMiddlewares/CompleteChallengeStreakTasks/createCompleteChallengeStreakTaskMiddlewares';
import { getCompleteChallengeStreakTasksMiddlewares } from '../../../../src/RouteMiddlewares/CompleteChallengeStreakTasks/getCompleteChallengeStreakTaskMiddlewares';
import { authenticationMiddlewares } from '../../../../src/SharedMiddleware/authenticationMiddlewares';

const completeChallengeStreakTasksRouter = Router();

completeChallengeStreakTasksRouter.get('/', ...getCompleteChallengeStreakTasksMiddlewares);

completeChallengeStreakTasksRouter.use(...authenticationMiddlewares);

completeChallengeStreakTasksRouter.post(`/`, ...createCompleteChallengeStreakTaskMiddlewares);

export { completeChallengeStreakTasksRouter };
