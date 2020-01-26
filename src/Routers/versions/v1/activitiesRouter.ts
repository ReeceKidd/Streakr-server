import { Router } from 'express';
import { getAllActivitiesMiddlewares } from '../../../RouteMiddlewares/Activity/getAllActivitiesMiddlewares';

const activitiesRouter = Router();

activitiesRouter.get(`/`, ...getAllActivitiesMiddlewares);

export { activitiesRouter };
