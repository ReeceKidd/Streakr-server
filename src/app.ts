import express from 'express';
import * as bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import * as Sentry from '@sentry/node';

import ApiVersions from './Server/versions';
import v1Router from './Routers/versions/v1';

import { getServiceConfig } from './getServiceConfig';
import { errorHandler } from './errorHandler';
import { agenda } from './Agenda/agenda';
import { sendEmail } from './email';

dotenv.config();
const { NODE_ENV } = getServiceConfig();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default ({ databaseURI }: { databaseURI: string }) => {
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

    mongoose.connect(databaseURI).catch(async err => {
        try {
            const message = `
            Environment: ${NODE_ENV}
            ${err.message}`;
            await sendEmail({ subject: 'Database Failure', text: message, emailFrom: 'notify@streakoid.com' });
        } catch (err) {
            console.log(err);
        }
    });

    if (NODE_ENV !== 'test') {
        agenda
            .start()
            .then(() => {
                console.log('Agenda processing');
            })
            .catch(err => {
                console.log(err);
            });
    }

    // Scripts used to initialize the daily streak complete checks.
    //initialiseTeamStreakTimezoneCheckerJobs();
    //initialiseSoloStreakTimezoneCheckerJobs();
    //initialiseAdjustForDaylightSavingsJobs();
    //initializeCompleteStreakReminderJobs();
    //initialiseChallengeStreakTimezoneCheckerJobs();

    app.use(`/${ApiVersions.v1}`, v1Router);

    app.use(errorHandler);

    return app;
};
