import { Router } from 'express';

import { getAllFriendRequestsMiddlewares } from '../../../RouteMiddlewares/FriendRequest/getAllFriendRequestsMiddlewares';
import { createFriendRequestMiddlewares } from '../../../RouteMiddlewares/FriendRequest/createFriendRequestMiddlewares';
import { deleteFriendRequestMiddlewares } from '../../../RouteMiddlewares/FriendRequest/deleteFriendRequestMiddlewares';
import { patchFriendRequestMiddlewares } from '../../../RouteMiddlewares/FriendRequest/patchFriendRequestMiddlewares';

export const friendRequestId = 'friendRequestId';

const friendRequestsRouter = Router();

friendRequestsRouter.get(`/`, ...getAllFriendRequestsMiddlewares);

friendRequestsRouter.delete(`/:${friendRequestId}`, ...deleteFriendRequestMiddlewares);

friendRequestsRouter.patch(`/:${friendRequestId}`, ...patchFriendRequestMiddlewares);

friendRequestsRouter.post(`/`, ...createFriendRequestMiddlewares);

export default friendRequestsRouter;
