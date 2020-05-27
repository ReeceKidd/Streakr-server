import { isTestEnvironment } from '../../../tests/setup/isTestEnvironment';
import { tearDownDatabase } from '../../../tests/setup/tearDownDatabase';
import { setupDatabase } from '../../../tests/setup/setupDatabase';
import { adjustForDaylightSavingsTime } from '../../../src/Agenda/AdjustForDaylightSavingsTime/adjustForDaylightSavingsTime';
import { agendaJobModel } from '../../../src/Models/AgendaJob';
import moment = require('moment');
import AgendaJobNames from '@streakoid/streakoid-models/lib/Types/AgendaJobNames';
import { AgendaJob } from '@streakoid/streakoid-models/lib/Models/AgendaJob';
import { Mongoose } from 'mongoose';
import { disconnectDatabase } from '../../setup/disconnectDatabase';

jest.setTimeout(120000);

const testName = 'adjustForDaylightSavingsTime';

describe(testName, () => {
    let database: Mongoose;
    beforeAll(async () => {
        if (isTestEnvironment()) {
            database = await setupDatabase({ testName });
        }
    });

    afterEach(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase({ database });
        }
    });

    afterAll(async () => {
        if (isTestEnvironment()) {
            await disconnectDatabase({ database });
        }
    });
    test('if localized run time hour does not equal 0 it means that daylight saving has occurred so next run at time gets adjusted', async () => {
        expect.assertions(6);

        const soloStreakDailyTracker = new agendaJobModel({
            name: AgendaJobNames.soloStreakDailyTracker,
            data: {
                timezone: 'Europe/London',
            },
            type: 'normal',
            priority: 10,
            nextRunAt: new Date('2019-11-07T23:00:02.888Z'),
            repeatInterval: '1 day',
            repeatTimezone: null,
            lastModifiedBy: null,
            lockedAt: null,
            lastRunAt: new Date('2019-11-06T23:00:02.888Z'),
            lastFinishedAt: new Date('2019-11-06T23:00:03.140Z'),
        });
        await soloStreakDailyTracker.save();
        const teamStreakDailyTracker = new agendaJobModel({
            name: AgendaJobNames.teamStreakDailyTracker,
            data: {
                timezone: 'Europe/London',
            },
            type: 'normal',
            priority: 10,
            nextRunAt: new Date('2019-11-07T23:00:02.888Z'),
            repeatInterval: '1 day',
            repeatTimezone: null,
            lastModifiedBy: null,
            lockedAt: null,
            lastRunAt: new Date('2019-11-06T23:00:02.888Z'),
            lastFinishedAt: new Date('2019-11-06T23:00:03.140Z'),
        });
        await teamStreakDailyTracker.save();
        const challengeStreakDailyTracker = new agendaJobModel({
            name: AgendaJobNames.challengeStreakDailyTracker,
            data: {
                timezone: 'Europe/London',
            },
            type: 'normal',
            priority: 10,
            nextRunAt: new Date('2019-11-07T23:00:02.888Z'),
            repeatInterval: '1 day',
            repeatTimezone: null,
            lastModifiedBy: null,
            lockedAt: null,
            lastRunAt: new Date('2019-11-06T23:00:02.888Z'),
            lastFinishedAt: new Date('2019-11-06T23:00:03.140Z'),
        });
        await challengeStreakDailyTracker.save();

        const timezone = 'Europe/London';

        await adjustForDaylightSavingsTime({ timezone });

        const updatedSoloStreakDailyTracker: AgendaJob = await agendaJobModel
            .findOne({ name: AgendaJobNames.teamStreakDailyTracker, 'data.timezone': timezone })
            .lean();

        const updatedSoloStreakDailyTrackerHour = moment
            .tz(new Date(updatedSoloStreakDailyTracker.nextRunAt), timezone)
            .hour();
        const updatedSoloStreakDailyTrackerMinute = moment
            .tz(new Date(updatedSoloStreakDailyTracker.nextRunAt), timezone)
            .minute();

        expect(updatedSoloStreakDailyTrackerHour).toEqual(23);
        expect(updatedSoloStreakDailyTrackerMinute).toEqual(59);

        const updatedTeamStreakDailyTracker: AgendaJob = await agendaJobModel
            .findOne({ name: AgendaJobNames.teamStreakDailyTracker, 'data.timezone': timezone })
            .lean();

        const updatedTeamStreakDailyTrackerHour = moment
            .tz(new Date(updatedTeamStreakDailyTracker.nextRunAt), timezone)
            .hour();
        const updatedTeamStreakDailyTrackerMinute = moment
            .tz(new Date(updatedTeamStreakDailyTracker.nextRunAt), timezone)
            .minute();

        expect(updatedTeamStreakDailyTrackerHour).toEqual(23);
        expect(updatedTeamStreakDailyTrackerMinute).toEqual(59);

        const updatedChallengeStreakDailyTracker: AgendaJob = await agendaJobModel
            .findOne({ name: AgendaJobNames.challengeStreakDailyTracker, 'data.timezone': timezone })
            .lean();

        const updatedChallengeStreakDailyTrackerHour = moment
            .tz(new Date(updatedChallengeStreakDailyTracker.nextRunAt), timezone)
            .hour();
        const updatedChallengeStreakDailyTrackerMinute = moment
            .tz(new Date(updatedChallengeStreakDailyTracker.nextRunAt), timezone)
            .minute();

        expect(updatedChallengeStreakDailyTrackerHour).toEqual(23);
        expect(updatedChallengeStreakDailyTrackerMinute).toEqual(59);
    });
});
