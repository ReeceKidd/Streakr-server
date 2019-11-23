import { Router } from 'express';
import { createIncompleteChallengeStreakTaskMiddlewares } from '../../../../src/RouteMiddlewares/IncompleteChallengeStreakTasks/createIncompleteChallengeStreakTaskMiddlewares';

const incompleteChallengeStreakTasksRouter = Router();

incompleteChallengeStreakTasksRouter.post(`/`, ...createIncompleteChallengeStreakTaskMiddlewares);

export { incompleteChallengeStreakTasksRouter };
