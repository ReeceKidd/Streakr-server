import { Router } from 'express';
import { getAllBadgesMiddlewares } from '../../../RouteMiddlewares/Badges/getAllBadgesMiddlewares';
import { createBadgeMiddlewares } from '../../../RouteMiddlewares/Badges/createBadgeMiddlewares';

export const badgeId = 'badgeId';

const badgesRouter = Router();

badgesRouter.get(`/`, ...getAllBadgesMiddlewares);

badgesRouter.post('/', ...createBadgeMiddlewares);

export { badgesRouter };
