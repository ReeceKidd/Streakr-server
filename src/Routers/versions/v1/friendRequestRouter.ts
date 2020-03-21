import { Router } from 'express';

import { getAllFriendRequestsMiddlewares } from '../../../RouteMiddlewares/FriendRequests/getAllFriendRequestsMiddlewares';
import { createFriendRequestMiddlewares } from '../../../RouteMiddlewares/FriendRequests/createFriendRequestMiddlewares';
import { deleteFriendRequestMiddlewares } from '../../../RouteMiddlewares/FriendRequests/deleteFriendRequestMiddlewares';
import { patchFriendRequestMiddlewares } from '../../../RouteMiddlewares/FriendRequests/patchFriendRequestMiddlewares';
import { authenticationMiddlewares } from '../../../../src/SharedMiddleware/authenticationMiddlewares';

export const friendRequestId = 'friendRequestId';

const friendRequestsRouter = Router();

friendRequestsRouter.use(...authenticationMiddlewares);

friendRequestsRouter.get(`/`, ...getAllFriendRequestsMiddlewares);

friendRequestsRouter.delete(`/:${friendRequestId}`, ...deleteFriendRequestMiddlewares);

friendRequestsRouter.patch(`/:${friendRequestId}`, ...patchFriendRequestMiddlewares);

friendRequestsRouter.post(`/`, ...createFriendRequestMiddlewares);

export { friendRequestsRouter };
