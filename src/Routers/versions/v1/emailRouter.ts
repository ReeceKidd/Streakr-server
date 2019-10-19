import { Router } from 'express';
import { createEmailMiddlewares } from '../../../../src/RouteMiddlewares/Email/createEmailMiddlewares';

const emailRouter = Router();

emailRouter.post(`/`, ...createEmailMiddlewares);

export { emailRouter };
