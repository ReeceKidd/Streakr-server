import { Router } from 'express';
import { getIncompleteTeamStreaksMiddlewares } from '../../../RouteMiddlewares/IncompleteTeamStreak/getIncompleteTeamStreaksMiddlewares';

export const completeTeamStreakId = 'completeTeamStreakId';

const incompleteTeamStreaksRouter = Router();

incompleteTeamStreaksRouter.get(`/`, ...getIncompleteTeamStreaksMiddlewares);

export { incompleteTeamStreaksRouter };
