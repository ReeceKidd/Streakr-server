import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as morgan from "morgan";
import * as passport from 'passport';

import DATABASE_CONFIG from '../config/DATABASE_CONFIG'
import { Environments } from '../config/ENVIRONMENT_CONFIG'

import v1Router from "./versions/v1";



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

export enum ApiVersions {
  v1 = 'v1'
}

app.use(`/${ApiVersions.v1}`, v1Router)

export default app