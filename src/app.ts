import express from 'express';
import * as bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import ApiVersions from './Server/versions';
import v1Router from './Routers/versions/v1';

import { getServiceConfig } from './getServiceConfig';
import { errorHandler } from './errorHandler';
import { agenda } from './Agenda/agenda';

dotenv.config();
const { DATABASE_URI } = getServiceConfig();

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ parameterLimit: 100000, limit: '50mb', extended: true }));

app.get(`/health`, (request, response) => {
    return response.status(200).send({ message: 'success' });
});

mongoose
    .connect(DATABASE_URI, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true })
    .catch(err => console.log(err.message));

agenda
    .start()
    .then(() => {
        console.log('Agenda processing');
    })
    .catch(err => {
        console.log(err);
    });

mongoose.set('useCreateIndex', true);

// Scripts used to initialise the daily streak complete checks.
// initialiseTeamStreakTimezoneCheckerJobs();
//initialiseSoloStreakTimezoneCheckerJobs()

app.use(`/${ApiVersions.v1}`, v1Router);

app.use(errorHandler);

export default app;
