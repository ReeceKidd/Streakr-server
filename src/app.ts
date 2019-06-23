import express from "express";
import * as bodyParser from "body-parser";
import mongoose from "mongoose";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";

import ApiVersions from "./Server/versions";
import v1Router from "./versions/v1";

import { getServiceConfig } from "./getServiceConfig";
import { errorHandler } from "./errorHandler";
import { initialiseStreakTimezoneCheckerJobs } from "./scripts/initaliseSoloStreakTimezoneCheckers";
dotenv.config();

const { DATABASE_URI } = getServiceConfig();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get(`/health`, (request, response, next) => {
  return response.status(200).send({ message: "success" });
});

app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(DATABASE_URI, { useNewUrlParser: true, useFindAndModify: false })
  .catch(err => console.log(err.message));

mongoose.set("useCreateIndex", true);

app.use(`/${ApiVersions.v1}`, v1Router);

app.use(errorHandler);

export default app;
