import { Router } from 'express';
import { createEmailMiddlewares } from '../../../../src/RouteMiddlewares/Emails/createEmailMiddlewares';

const emailRouter = Router();

emailRouter.post(`/`, ...createEmailMiddlewares);

export { emailRouter };
