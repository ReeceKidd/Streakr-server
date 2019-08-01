import { Router } from "express";
import { getUsersMiddlewares } from "../RouteMiddlewares/User/getUsersMiddlewares";
import { registerUserMiddlewares } from "../RouteMiddlewares/User/registerUserMiddlewares";
import { deleteUserMiddlewares } from "../RouteMiddlewares/User/deleteUserMiddlewares";

export const userId = "userId";

const usersRouter = Router();

usersRouter.get("/", ...getUsersMiddlewares);

usersRouter.post(`/`, ...registerUserMiddlewares);

usersRouter.delete(`/`, ...deleteUserMiddlewares);

export default usersRouter;
