import { Router } from 'express';
import { getCompleteTeamStreaksMiddlewares } from '../../../RouteMiddlewares/CompleteTeamStreak/getCompleteTeamStreaksMiddlewares';

export const completeTeamStreakId = 'completeTeamStreakId';

const completeTeamStreaksRouter = Router();

completeTeamStreaksRouter.get(`/`, ...getCompleteTeamStreaksMiddlewares);

export { completeTeamStreaksRouter };
