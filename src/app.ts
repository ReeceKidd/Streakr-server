import express from 'express';
import * as bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import * as Sentry from '@sentry/node';
import { Request, Response, NextFunction } from 'express';

import ApiVersions from './Server/versions';
import v1Router from './Routers/versions/v1';

import { getServiceConfig } from './getServiceConfig';
import { errorHandler } from './errorHandler';
import { agenda } from './Agenda/agenda';
import { sendEmail } from './email';

dotenv.config();
const { DATABASE_URI, NODE_ENV } = getServiceConfig();

if (NODE_ENV !== 'test') {
    Sentry.init({
        dsn: 'https://ef376eda094746328e5904569e6ccbe7@o387464.ingest.sentry.io/5222901',
        attachStacktrace: true,
    });
}

const app = express();

if (NODE_ENV !== 'test') {
    app.use(Sentry.Handlers.requestHandler());
}

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
        Environment: ${NODE_ENV}
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

// Scripts used to initialize the daily streak complete checks.
//initialiseTeamStreakTimezoneCheckerJobs();
//initialiseSoloStreakTimezoneCheckerJobs();
//initialiseAdjustForDaylightSavingsJobs();
//initializeCompleteStreakReminderJobs();
//initialiseChallengeStreakTimezoneCheckerJobs();

app.use(`/${ApiVersions.v1}`, v1Router);

const setUserInformationForSentry = (request: Request, response: Response, next: NextFunction): void => {
    const user = response.locals.user;
    if (user && user.email && user.username && user._id) {
        Sentry.setUser({ email: user.email, username: user.username, id: user._id });
    }
    next();
};

if (NODE_ENV !== 'test') {
    app.use(setUserInformationForSentry);
    app.use(Sentry.Handlers.errorHandler());
}

app.use(errorHandler);

export default app;
