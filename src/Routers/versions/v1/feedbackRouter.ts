import { Router } from 'express';

import { createFeedbackMiddlewares } from '../../../RouteMiddlewares/Feedback/createFeedbackMiddlewares';
import { deleteFeedbackMiddlewares } from '../../../RouteMiddlewares/Feedback/deleteFeedbackMiddlewares';

export const feedbackId = 'feedbackId';

const feedbackRouter = Router();

feedbackRouter.post(`/`, ...createFeedbackMiddlewares);

feedbackRouter.delete(`/:${feedbackId}`, ...deleteFeedbackMiddlewares);

export { feedbackRouter };
