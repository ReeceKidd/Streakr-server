import express from "express";
import * as bodyParser from "body-parser";
import mongoose from "mongoose";
import passport from "passport";

import { Environments } from "../config/ENVIRONMENT_CONFIG";


import ApiVersions from "./Server/versions";
import v1Router from "./versions/v1";
import databaseConnectionString from "../config/databaseConnectionString";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get(`/health`, (request, response, next) => {
  return response.status(200).send({ message: "success" });
});

app.use(passport.initialize());
app.use(passport.session());

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = Environments.PROD;
}

mongoose
  .connect(
    databaseConnectionString,
    { useNewUrlParser: true, useFindAndModify: false }
  )
  .catch(err => console.log(err.message));

mongoose.set("useCreateIndex", true);

app.use(`/${ApiVersions.v1}`, v1Router);

export default app;