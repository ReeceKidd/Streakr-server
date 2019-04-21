import { Router } from "express";

import authRouter from "../Routers/authRouter";
import userRouter from "../Routers/userRouter";
import soloStreaksRouter from "../Routers/soloStreaksRouter";
import testRouter from "../Routers/testRouter";
import usersRouter from "../Routers/usersRouter";
import friendsRouter from "../Routers/friendsRouter";

export enum RouteCategories {
    user = 'user',
    users = 'users',
    auth = 'auth',
    soloStreaks = 'solo-streaks',
    test = 'test',
    friends = 'friends'
}

const v1Router = Router();

v1Router.use(`/${RouteCategories.soloStreaks}`, soloStreaksRouter)
v1Router.use(`/${RouteCategories.user}`, userRouter)
v1Router.use(`/${RouteCategories.users}`, usersRouter)
v1Router.use(`/${RouteCategories.auth}`, authRouter)
v1Router.use(`/${RouteCategories.test}`, testRouter)
v1Router.use(`/${RouteCategories.friends}`, friendsRouter)



export default v1Router
