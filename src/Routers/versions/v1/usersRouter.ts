import { Router } from 'express';

import { getAllUsersMiddlewares } from '../../../RouteMiddlewares/Users/getAllUsersMiddlewares';
import { getUserMiddlewares } from '../../../RouteMiddlewares/Users/getUserMiddlewares';
import { authenticationMiddlewares } from '../../../../src/SharedMiddleware/authenticationMiddlewares';
import { getFollowersMiddlewares } from '../../../../src/RouteMiddlewares/Users/Followers/getFollowersMiddlewares';
import { followUserMiddlewares } from '../../../../src/RouteMiddlewares/Users/Following/followUserMiddlewares';
import { unfollowUserMiddlewares } from '../../../../src/RouteMiddlewares/Users/Following/unfollowUserMiddlewares';
import { getFollowingMiddlewares } from '../../../../src/RouteMiddlewares/Users/Following/getFollowingMiddlewares';

export const userId = 'userId';
export const userToUnfollowId = 'userToUnfollowId';

const usersRouter = Router();

usersRouter.get('/', ...getAllUsersMiddlewares);

usersRouter.get(`/:${userId}`, ...getUserMiddlewares);

// Following routes

usersRouter.get(`/:${userId}/following`, ...getFollowingMiddlewares);

usersRouter.use(...authenticationMiddlewares);

usersRouter.post(`/:${userId}/following`, ...followUserMiddlewares);

usersRouter.patch(`/:${userId}/following/:${userToUnfollowId}`, ...unfollowUserMiddlewares);

// Followers routes

usersRouter.get(`/:${userId}/followers`, ...getFollowersMiddlewares);

export { usersRouter };
