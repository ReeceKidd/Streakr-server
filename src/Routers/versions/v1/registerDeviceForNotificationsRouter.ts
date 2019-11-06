import { Router } from 'express';
import { registerDeviceForPushNotificationsMiddlewares } from '../../../RouteMiddlewares/PushNotifications/registerDeviceForPushNotifications';

const registerDeviceForNotificationsRouter = Router();

registerDeviceForNotificationsRouter.post(`/`, ...registerDeviceForPushNotificationsMiddlewares);

export { registerDeviceForNotificationsRouter };
