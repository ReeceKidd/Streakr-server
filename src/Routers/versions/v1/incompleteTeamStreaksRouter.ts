import { Router } from 'express';
import { getIncompleteTeamStreaksMiddlewares } from '../../../RouteMiddlewares/IncompleteTeamStreaks/getIncompleteTeamStreaksMiddlewares';

export const completeTeamStreakId = 'completeTeamStreakId';

const incompleteTeamStreaksRouter = Router();

incompleteTeamStreaksRouter.get(`/`, ...getIncompleteTeamStreaksMiddlewares);

export { incompleteTeamStreaksRouter };
