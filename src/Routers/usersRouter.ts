import { Router } from "express";
import { getUsersMiddlewares } from "../RouteMiddlewares/User/getUsersMiddlewares";
import { verifyJsonWebTokenMiddlewares } from "../RouteMiddlewares/Utils/verifyJsonWebTokenMiddlewares";

export const UsersPaths = {
    getUsersByRegexSearch: "",
};

const usersRouter = Router()

usersRouter.use('*', ...verifyJsonWebTokenMiddlewares)

usersRouter.get(
    `/${UsersPaths.getUsersByRegexSearch}`,
    ...getUsersMiddlewares
);

export default usersRouter;