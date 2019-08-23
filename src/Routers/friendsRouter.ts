import { Router } from "express";
import { getFriendsMiddlewares } from "../RouteMiddlewares/User/Friends/getFriendsMiddlewares";
import { addFriendMiddlewares } from "../RouteMiddlewares/User/Friends/addFriendMiddlewares";
import { deleteFriendMiddlewares } from "../RouteMiddlewares/User/Friends/deleteFriendsMiddlewares";

export const friendId = "friendId";

const friendsRouter = Router();

friendsRouter.get(`/:${friendId}`, ...getFriendsMiddlewares);

friendsRouter.post(`/`, ...addFriendMiddlewares);

friendsRouter.delete(`/:${friendId}`, ...deleteFriendMiddlewares);

export default friendsRouter;
