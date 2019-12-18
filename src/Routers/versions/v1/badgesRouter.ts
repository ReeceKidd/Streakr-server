import { Router } from 'express';
import { getAllBadgesMiddlewares } from '../../../RouteMiddlewares/Badges/getAllBadgesMiddlewares';
import { createBadgeMiddlewares } from '../../../RouteMiddlewares/Badges/createBadgeMiddlewares';
import { getOneBadgeMiddlewares } from '../../../RouteMiddlewares/Badges/getOneBadgeMiddlewares';

export const badgeId = 'badgeId';

const badgesRouter = Router();

badgesRouter.get(`/`, ...getAllBadgesMiddlewares);

badgesRouter.get(`/:${badgeId}`, ...getOneBadgeMiddlewares);

badgesRouter.post('/', ...createBadgeMiddlewares);

export { badgesRouter };
