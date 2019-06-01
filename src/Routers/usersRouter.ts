import { Router } from "express";
import { getUsersMiddlewares } from "../RouteMiddlewares/User/getUsersMiddlewares";
import { verifyJsonWebTokenMiddlewares } from "../RouteMiddlewares/Utils/verifyJsonWebTokenMiddlewares";
import { addFriendMiddlewares } from "../RouteMiddlewares/Friends/addFriendMiddlewares";
import { getFriendsMiddlewares } from "../RouteMiddlewares/Friends/getFriendsMiddlewares";
import { registerUserMiddlewares } from "../RouteMiddlewares/User/registerUserMiddlewares";

export const userId = "userId";

export enum UserProperties {
    friends = "friends"
}

const usersRouter = Router();

usersRouter.get(
    "/",
    ...verifyJsonWebTokenMiddlewares,
    ...getUsersMiddlewares
);

usersRouter.post(
    `/`,
    ...registerUserMiddlewares
);

usersRouter.get(
    `/:${userId}/${UserProperties.friends}`,
    ...verifyJsonWebTokenMiddlewares,
    ...getFriendsMiddlewares);

usersRouter.put(
    `/:${userId}/${UserProperties.friends}`,
    ...verifyJsonWebTokenMiddlewares,
    ...addFriendMiddlewares);

export default usersRouter;