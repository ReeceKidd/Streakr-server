import { Router } from "express";

import { verifyJsonWebTokenMiddlewares } from "../../src/RouteMiddlewares/Utils/verifyJsonWebTokenMiddlewares";
import { getFriendsMiddlewares } from "../RouteMiddlewares/Friends/getFriendsMiddlewares"
import { addFriendMiddlewares } from "../RouteMiddlewares/Friends/addFriendMiddlewares";


export const userId = "userId"

export const FriendsPaths = {
    add: "add",
};

const friendsRouter = Router();

friendsRouter.use('*', ...verifyJsonWebTokenMiddlewares)

friendsRouter.get(`/:${userId}`, getFriendsMiddlewares)
friendsRouter.put(`/${FriendsPaths.add}/:${userId}`, addFriendMiddlewares)

export default friendsRouter;
