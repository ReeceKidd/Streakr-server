import { Router } from "express";
import { getUsersMiddlewares } from "../RouteMiddlewares/User/getUsersMiddlewares";
import { registerUserMiddlewares } from "../RouteMiddlewares/User/registerUserMiddlewares";

export const userId = "userId";

const usersRouter = Router();

usersRouter.get("/", ...getUsersMiddlewares);

usersRouter.post(`/`, ...registerUserMiddlewares);

export default usersRouter;
