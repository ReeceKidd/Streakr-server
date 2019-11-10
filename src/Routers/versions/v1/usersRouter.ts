import { Router } from 'express';

import { getUsersMiddlewares } from '../../../RouteMiddlewares/Users/getUsersMiddlewares';
import { getUserMiddlewares } from '../../../RouteMiddlewares/Users/getUserMiddlewares';

import { getFriendsMiddlewares } from '../../../RouteMiddlewares/Users/Friends/getFriendsMiddlewares';
import { addFriendMiddlewares } from '../../../RouteMiddlewares/Users/Friends/addFriendMiddlewares';
import { deleteFriendMiddlewares } from '../../../RouteMiddlewares/Users/Friends/deleteFriendsMiddlewares';

export const userId = 'userId';
export const friendId = 'friendId';

const usersRouter = Router();

usersRouter.get('/', ...getUsersMiddlewares);

usersRouter.get(`/:${userId}`, ...getUserMiddlewares);

// Friends routes

usersRouter.get(`/:${userId}/friends`, ...getFriendsMiddlewares);

usersRouter.post(`/:${userId}/friends`, ...addFriendMiddlewares);

usersRouter.patch(`/:${userId}/friends/:${friendId}`, ...deleteFriendMiddlewares);

export { usersRouter };
