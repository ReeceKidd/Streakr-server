import { Router } from 'express';
import { getCompleteTeamStreaksMiddlewares } from '../../../RouteMiddlewares/CompleteTeamStreaks/getCompleteTeamStreaksMiddlewares';

export const completeTeamStreakId = 'completeTeamStreakId';

const completeTeamStreaksRouter = Router();

completeTeamStreaksRouter.get(`/`, ...getCompleteTeamStreaksMiddlewares);

export { completeTeamStreaksRouter };
