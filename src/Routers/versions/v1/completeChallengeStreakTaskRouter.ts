import { Router } from 'express';
import { createCompleteChallengeStreakTaskMiddlewares } from '../../../../src/RouteMiddlewares/CompleteChallengeStreakTasks/createCompleteChallengeStreakTaskMiddlewares';
import { getCompleteChallengeStreakTasksMiddlewares } from '../../../../src/RouteMiddlewares/CompleteChallengeStreakTasks/getCompleteChallengeStreakTaskMiddlewares';

const completeChallengeStreakTasksRouter = Router();

completeChallengeStreakTasksRouter.get('/', ...getCompleteChallengeStreakTasksMiddlewares);

completeChallengeStreakTasksRouter.post(`/`, ...createCompleteChallengeStreakTaskMiddlewares);

export { completeChallengeStreakTasksRouter };
