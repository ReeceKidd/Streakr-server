import { Router } from "express";
import { getUsersMiddlewares } from "../RouteMiddlewares/User/getUsersMiddlewares";
import { registerUserMiddlewares } from "../RouteMiddlewares/User/registerUserMiddlewares";
import { deleteUserMiddlewares } from "../RouteMiddlewares/User/deleteUserMiddlewares";
import { getUserMiddlewares } from "../RouteMiddlewares/User/getUserMiddlewares";

export const userId = "userId";

const usersRouter = Router();

usersRouter.get("/", ...getUsersMiddlewares);

usersRouter.get(`/:${userId}`, ...getUserMiddlewares);

usersRouter.post(`/`, ...registerUserMiddlewares);

usersRouter.delete(`/:${userId}`, ...deleteUserMiddlewares);

export default usersRouter;
