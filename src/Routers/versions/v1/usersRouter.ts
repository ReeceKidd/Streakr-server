import { Router } from 'express';

import { getUsersMiddlewares } from '../../../RouteMiddlewares/User/getUsersMiddlewares';
import { getUserMiddlewares } from '../../../RouteMiddlewares/User/getUserMiddlewares';

import { getFriendsMiddlewares } from '../../../RouteMiddlewares/User/Friends/getFriendsMiddlewares';
import { addFriendMiddlewares } from '../../../RouteMiddlewares/User/Friends/addFriendMiddlewares';
import { deleteFriendMiddlewares } from '../../../RouteMiddlewares/User/Friends/deleteFriendsMiddlewares';
import { patchUserMiddlewares } from '../../../RouteMiddlewares/User/patchUserMiddlewares';

export const userId = 'userId';
export const friendId = 'friendId';

const usersRouter = Router();

usersRouter.get('/', ...getUsersMiddlewares);

usersRouter.get(`/:${userId}`, ...getUserMiddlewares);

usersRouter.patch(`/:${userId}`, ...patchUserMiddlewares);

// Friends routes

usersRouter.get(`/:${userId}/friends`, ...getFriendsMiddlewares);

usersRouter.post(`/:${userId}/friends`, ...addFriendMiddlewares);

usersRouter.patch(`/:${userId}/friends/:${friendId}`, ...deleteFriendMiddlewares);

export { usersRouter };
