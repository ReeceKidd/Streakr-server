import { Router } from "express";

import { verifyJsonWebTokenMiddlewares } from "../../src/RouteMiddlewares/Utils/verifyJsonWebTokenMiddlewares";
import { addFriendMiddlewares } from "../RouteMiddlewares/Friends/addFriendMiddlewares";

export const FriendPaths = {
    add: "add",
};

const friendRouter = Router();

friendRouter.use('*', ...verifyJsonWebTokenMiddlewares)

friendRouter.put(`/${FriendPaths.add}`, addFriendMiddlewares)


export default friendRouter;
