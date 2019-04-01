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

NEEC TO FIX UNIT TEST AND THEN ADD INTERGRATION TESTS FOR GET USERS ROUTE
THEN CREATE THE ADD FRIEND ROUTE.reece kidd