import { Router } from 'express';
import { getCurrentUserMiddlewares } from '../../../../src/RouteMiddlewares/User/getCurrentUser';
import { patchCurrentUserMiddlewares } from '../../../../src/RouteMiddlewares/User/patchCurrentUserMiddlewares';
import { authenticationMiddlewares } from '../../../../src/SharedMiddleware/authenticationMiddlewares';
import { patchCurrentUserPushNotificationsMiddlewares } from '../../../../src/RouteMiddlewares/User/PushNotifications/patchCurrentUserPushNotifications';

const userRouter = Router();

userRouter.use(...authenticationMiddlewares);

userRouter.get('/', ...getCurrentUserMiddlewares);

userRouter.patch('/', ...patchCurrentUserMiddlewares);

userRouter.patch('/push-notifications', ...patchCurrentUserPushNotificationsMiddlewares);

export { userRouter };
