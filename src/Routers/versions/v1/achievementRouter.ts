import { Router } from 'express';
import { getAllAchievementsMiddlewares } from '../../../RouteMiddlewares/Achievements/getAllAchievementsMiddlewares';
import { createAchievementMiddlewares } from '../../../../src/RouteMiddlewares/Achievements/createAchievementMiddlewares';
import { authenticationMiddlewares } from '../../../../src/SharedMiddleware/authenticationMiddlewares';

const achievementsRouter = Router();

achievementsRouter.get(`/`, ...getAllAchievementsMiddlewares);

achievementsRouter.use(...authenticationMiddlewares);

achievementsRouter.post(`/`, ...createAchievementMiddlewares);

export { achievementsRouter };
