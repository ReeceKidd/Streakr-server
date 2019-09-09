import express from "express";
import * as bodyParser from "body-parser";
import mongoose from "mongoose";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
const AgendaDash = require("agendash");

import ApiVersions from "./Server/versions";
import v1Router from "./Routers/versions/v1";

import { getServiceConfig } from "./getServiceConfig";
import { errorHandler } from "./errorHandler";
import { agenda, AgendaJobs } from "./Agenda/agenda";
import { initialiseSoloStreakTimezoneCheckerJobs } from "./scripts/initaliseSoloStreakTimezoneCheckers";

dotenv.config();

const { DATABASE_URI } = getServiceConfig();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get(`/health`, (request, response, next) => {
  return response.status(200).send({ message: "success" });
});

app.use("/dash", AgendaDash(agenda));

app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(DATABASE_URI, { useNewUrlParser: true, useFindAndModify: false })
  .catch(err => console.log(err.message));

agenda
  .start()
  .then(() => {
    console.log("Agenda processing");
  })
  .catch(err => {
    console.log("Agenda error");
    console.log(err);
  });

mongoose.set("useCreateIndex", true);

app.use(`/${ApiVersions.v1}`, v1Router);

app.use(errorHandler);

export default app;
