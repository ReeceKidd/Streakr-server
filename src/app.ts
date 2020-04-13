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
import { sendEmail } from './email';

dotenv.config();
const { DATABASE_URI, NODE_ENV } = getServiceConfig();

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ parameterLimit: 100000, limit: '50mb', extended: true }));

app.get(`/health`, (request, response) => {
    return response.status(200).send({ message: 'success' });
});

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(DATABASE_URI).catch(async err => {
    try {
        const message = `
        Envirionment: ${NODE_ENV}
        ${err.message}`;
        await sendEmail({ subject: 'Database Failure', text: message, emailFrom: 'notify@streakoid.com' });
    } catch (err) {
        console.log(err);
    }
});

agenda
    .start()
    .then(() => {
        console.log('Agenda processing');
    })
    .catch(err => {
        console.log(err);
    });

// Scripts used to initialise the daily streak complete checks.
//initialiseTeamStreakTimezoneCheckerJobs();
//initialiseSoloStreakTimezoneCheckerJobs();
//initialiseAdjustForDaylightSavingsJobs();
//initialiseCompleteStreakReminderJobs();
//initialiseChallengeStreakTimezoneCheckerJobs();

app.use(`/${ApiVersions.v1}`, v1Router);

app.use(errorHandler);

export default app;
