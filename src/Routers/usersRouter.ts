import { Router } from "express";
import { getUsersMiddlewares } from "../RouteMiddlewares/User/getUsersMiddlewares";

export const UsersPaths = {
    getUsersByRegexSearch: "",
};

const usersRouter = Router();

usersRouter.get(
    `/${UsersPaths.getUsersByRegexSearch}`,
    ...getUsersMiddlewares
);

export default usersRouter;
