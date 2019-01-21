import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as morgan from "morgan";
import * as passport from 'passport'
import LoggerStream from "./Logging/LoggerStream";
import config from "../config/DATABASE_CONFIG";

import authRouter from "./Routers/authRouter";
import userRouter from "./Routers/userRouter";

import DATABASE_CONFIG from '../config/DATABASE_CONFIG'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('common', { stream: LoggerStream }))
app.use(passport.initialize())
app.use(passport.session())

const databseURL = DATABASE_CONFIG[process.env.NODE_ENV]
mongoose
  .connect(
    databseURL,
    { useNewUrlParser: true }
  )
  .catch(err => console.log(err.message));

const user = 'user'
const auth = 'auth'
app.use(`/${user}`, userRouter)
app.use(`/${auth}`, authRouter)

export default app
