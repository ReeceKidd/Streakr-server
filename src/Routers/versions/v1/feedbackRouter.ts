import { Router } from 'express';

import { createFeedbackMiddlewares } from '../../../RouteMiddlewares/Feedback/createFeedbackMiddlewares';

export const feedbackId = 'feedbackId';

const feedbackRouter = Router();

feedbackRouter.post(`/`, ...createFeedbackMiddlewares);

export { feedbackRouter };
