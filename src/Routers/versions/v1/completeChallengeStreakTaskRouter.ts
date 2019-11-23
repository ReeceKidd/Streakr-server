import { Router } from 'express';
import { createCompleteChallengeStreakTaskMiddlewares } from '../../../../src/RouteMiddlewares/CompleteChallengeStreakTasks/createCompleteChallengeStreakTaskMiddlewares';

const completeChallengeStreakTasksRouter = Router();

completeChallengeStreakTasksRouter.post(`/`, ...createCompleteChallengeStreakTaskMiddlewares);

export { completeChallengeStreakTasksRouter };
