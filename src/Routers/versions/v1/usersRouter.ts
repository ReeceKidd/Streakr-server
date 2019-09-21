import { Router } from "express";

import { getUsersMiddlewares } from "../../../RouteMiddlewares/User/getUsersMiddlewares";
import { registerUserMiddlewares } from "../../../RouteMiddlewares/User/registerUserMiddlewares";
import { deleteUserMiddlewares } from "../../../RouteMiddlewares/User/deleteUserMiddlewares";
import { getUserMiddlewares } from "../../../RouteMiddlewares/User/getUserMiddlewares";

import { getFriendsMiddlewares } from "../../../RouteMiddlewares/User/Friends/getFriendsMiddlewares";
import { addFriendMiddlewares } from "../../../RouteMiddlewares/User/Friends/addFriendMiddlewares";
import { deleteFriendMiddlewares } from "../../../RouteMiddlewares/User/Friends/deleteFriendsMiddlewares";
import { timezoneMiddlewares } from "../../../SharedMiddleware/timezoneMiddlewares";
import { patchUserMiddlewares } from "../../../RouteMiddlewares/User/patchUserMiddlewares";

export const userId = "userId";
export const friendId = "friendId";

const usersRouter = Router();

usersRouter.get("/", ...getUsersMiddlewares);

usersRouter.get(`/:${userId}`, ...getUserMiddlewares);

usersRouter.patch(`/:${userId}`, ...patchUserMiddlewares);

usersRouter.delete(`/:${userId}`, ...deleteUserMiddlewares);

// Friends routes

usersRouter.get(`/:${userId}/friends`, ...getFriendsMiddlewares);

usersRouter.post(`/:${userId}/friends`, ...addFriendMiddlewares);

usersRouter.delete(
  `/:${userId}/friends/:${friendId}`,
  ...deleteFriendMiddlewares
);

usersRouter.post(`/`, ...registerUserMiddlewares);

export default usersRouter;
