import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as morgan from "morgan";
import * as passport from 'passport';

import authRouter from "./Routers/authRouter";
import userRouter from "./Routers/userRouter";
import soloStreakRouter from "./Routers/soloStreakRouter";
import soloStreaksRouter from "./Routers/soloStreaksRouter";
import testRouter from "./Routers/testRouter";
import usersRouter from "./Routers/usersRouter";
import friendsRouter from "./Routers/friendsRouter";

import DATABASE_CONFIG from '../config/DATABASE_CONFIG'
import { Environments } from '../config/ENVIRONMENT_CONFIG'



const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== Environments.TEST) {
  app.use(morgan('common'))
}

app.use(passport.initialize())
app.use(passport.session())

const databseURL = DATABASE_CONFIG[process.env.NODE_ENV]
mongoose
  .connect(
    databseURL,
    { useNewUrlParser: true }
  )
  .catch(err => console.log(err.message));

export enum RouteCategories {
  user = 'user',
  users = 'users',
  auth = 'auth',
  soloStreak = 'solo-streak',
  soloStreaks = 'solo-streaks',
  test = 'test',
  friends = 'friends'
}

app.use(`/${RouteCategories.soloStreak}`, soloStreakRouter)
app.use(`/${RouteCategories.soloStreaks}`, soloStreaksRouter)
app.use(`/${RouteCategories.user}`, userRouter)
app.use(`/${RouteCategories.users}`, usersRouter)
app.use(`/${RouteCategories.auth}`, authRouter)
app.use(`/${RouteCategories.test}`, testRouter)
app.use(`/${RouteCategories.friends}`, friendsRouter)

export default app
