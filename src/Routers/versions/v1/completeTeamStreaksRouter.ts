import { Router } from 'express';
import { getCompleteTeamStreaksMiddlewares } from '../../../RouteMiddlewares/CompleteTeamStreak/getCompleteTeamStreaksMiddlewares';
import { deleteCompleteTeamStreakMiddlewares } from '../../../RouteMiddlewares/CompleteTeamStreak/deleteCompleteTeamStreaksMiddlewares';

export const completeTeamStreakId = 'completeTeamStreakId';

const completeTeamStreaksRouter = Router();

completeTeamStreaksRouter.get(`/`, ...getCompleteTeamStreaksMiddlewares);

completeTeamStreaksRouter.delete(`/:${completeTeamStreakId}`, ...deleteCompleteTeamStreakMiddlewares);

export { completeTeamStreaksRouter };
