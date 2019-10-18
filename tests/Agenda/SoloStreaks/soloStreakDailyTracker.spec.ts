/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';

import { createSoloStreakDailyTrackerJob } from '../../../src/scripts/initaliseSoloStreakTimezoneCheckers';
import streakoid from '../../../src/streakoid';

import StreakStatus from '@streakoid/streakoid-sdk/lib/StreakStatus';
import { StreakTrackingEventTypes, StreakTypes } from '@streakoid/streakoid-sdk/lib';
import { getServiceConfig } from '../../../src/getServiceConfig';
import { soloStreakModel } from '../../../src/Models/SoloStreak';
import { streakTrackingEventModel } from '../../../src/Models/StreakTrackingEvent';
import { dailyJobModel } from '../../../src/Models/DailyJob';
import { completeSoloStreakTaskModel } from '../../../src/Models/CompleteSoloStreakTask';

const { TEST_DATABASE_URI, NODE_ENV } = getServiceConfig();

jest.setTimeout(120000);

const username = 'solo-streak-daily-tracker-name';
const email = 'solostreaktracker@gmail.com';

describe('soloStreakDailyTracker', () => {
    let userId: string;

    beforeAll(async () => {
        if (NODE_ENV === 'test' && TEST_DATABASE_URI.includes('TEST')) {
            await mongoose.connect(TEST_DATABASE_URI, { useNewUrlParser: true, useFindAndModify: false });
            await mongoose.connection.dropDatabase();
            const user = await streakoid.users.create({ username, email });
            userId = user._id;
        }
    });

    afterAll(async () => {
        if (NODE_ENV === 'test' && TEST_DATABASE_URI.includes('TEST')) {
            await mongoose.connection.dropDatabase();
            await mongoose.disconnect();
        }
    });

    afterEach(async () => {
        if (NODE_ENV === 'test' && TEST_DATABASE_URI.includes('TEST')) {
            await soloStreakModel.deleteMany({});
            await streakTrackingEventModel.deleteMany({});
            await completeSoloStreakTaskModel.deleteMany({});
            await dailyJobModel.deleteMany({});
        }
    });

    test('initialises soloStreakDailyTracker job correctly', async () => {
        expect.assertions(10);
        const timezone = 'Europe/London';
        const job = await createSoloStreakDailyTrackerJob(timezone);
        const { attrs } = job as any;
        const { name, data, type, priority, nextRunAt, _id, repeatInterval, repeatTimezone } = attrs;
        expect(name).toEqual('soloStreakDailyTracker');
        expect(data.timezone).toEqual('Europe/London');
        expect(Object.keys(data)).toEqual(['timezone']);
        expect(type).toEqual('normal');
        expect(priority).toEqual(10);
        expect(nextRunAt).toBeDefined();
        expect(_id).toBeDefined();
        expect(repeatInterval).toBeDefined();
        expect(repeatTimezone).toEqual(null);
        expect(Object.keys(attrs)).toEqual([
            'name',
            'data',
            'type',
            'priority',
            'nextRunAt',
            'repeatInterval',
            'repeatTimezone',
            '_id',
        ]);

        await streakoid.agendaJobs.deleteOne(String(_id));
    });

    test('maintains streaks correctly', async () => {
        expect.assertions(31);

        const timezone = 'Europe/London';

        const streakName = 'Painting';
        const streakDescription = 'Everyday we must paint for 30 minutes';

        const maintainedSoloStreak = await streakoid.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });
        const maintainedSoloStreakId = maintainedSoloStreak._id;

        const completeSoloStreakTask = await streakoid.completeSoloStreakTasks.create({
            userId,
            soloStreakId: maintainedSoloStreakId,
        });

        expect(completeSoloStreakTask._id).toBeDefined();
        expect(completeSoloStreakTask.userId).toEqual(userId);
        expect(completeSoloStreakTask.streakId).toEqual(maintainedSoloStreakId);
        expect(completeSoloStreakTask.taskCompleteTime).toEqual(expect.any(String));
        expect(completeSoloStreakTask.taskCompleteDay).toEqual(expect.any(String));
        expect(completeSoloStreakTask.createdAt).toEqual(expect.any(String));
        expect(completeSoloStreakTask.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(completeSoloStreakTask).sort()).toEqual(
            [
                '_id',
                'userId',
                'streakId',
                'taskCompleteTime',
                'taskCompleteDay',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const job = await createSoloStreakDailyTrackerJob(timezone);

        await job.run();

        const updatedSoloStreak = await streakoid.soloStreaks.getOne(maintainedSoloStreakId);

        expect(updatedSoloStreak.streakName).toEqual(streakName);
        expect(updatedSoloStreak.status).toEqual(StreakStatus.live);
        expect(updatedSoloStreak.streakDescription).toEqual(streakDescription);
        expect(updatedSoloStreak.userId).toEqual(userId);
        expect(updatedSoloStreak.completedToday).toEqual(false);
        expect(updatedSoloStreak.active).toEqual(true);
        expect(updatedSoloStreak.pastStreaks.length).toEqual(0);
        expect(updatedSoloStreak.timezone).toEqual(expect.any(String));
        const currentStreak = updatedSoloStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(1);
        expect(currentStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(currentStreak)).toEqual(['startDate', 'numberOfDaysInARow']);
        expect(updatedSoloStreak._id).toEqual(expect.any(String));
        expect(updatedSoloStreak.createdAt).toEqual(expect.any(String));
        expect(updatedSoloStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedSoloStreak).sort()).toEqual(
            [
                '_id',
                'status',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'streakName',
                'streakDescription',
                'userId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const streakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
            userId,
            streakId: maintainedSoloStreakId,
        });
        const streakTrackingEvent = streakTrackingEvents[0];

        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.maintainedStreak);
        expect(streakTrackingEvent.streakId).toEqual(maintainedSoloStreakId);
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.solo);
        expect(streakTrackingEvent.userId).toEqual(userId);
        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });

    test('manages lost streaks correctly', async () => {
        expect.assertions(35);

        const timezone = 'Europe/London';

        const streakName = 'Stretching';
        const streakDescription = 'Everyday I must stretch for 30 minutes';

        const lostSoloStreak = await streakoid.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });
        const lostSoloStreakId = lostSoloStreak._id;

        const completeSoloStreakTask = await streakoid.completeSoloStreakTasks.create({
            userId,
            soloStreakId: lostSoloStreakId,
        });

        expect(completeSoloStreakTask._id).toBeDefined();
        expect(completeSoloStreakTask.userId).toEqual(userId);
        expect(completeSoloStreakTask.streakId).toEqual(lostSoloStreak._id);
        expect(completeSoloStreakTask.taskCompleteTime).toEqual(expect.any(String));
        expect(completeSoloStreakTask.taskCompleteDay).toEqual(expect.any(String));
        expect(completeSoloStreakTask.createdAt).toEqual(expect.any(String));
        expect(completeSoloStreakTask.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(completeSoloStreakTask).sort()).toEqual(
            [
                '_id',
                'userId',
                'streakId',
                'taskCompleteTime',
                'taskCompleteDay',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const job = await createSoloStreakDailyTrackerJob(timezone);

        await job.run();
        // Simulates an additional day passing
        await job.run();

        const updatedSoloStreak = await streakoid.soloStreaks.getOne(lostSoloStreakId);

        expect(updatedSoloStreak.streakName).toEqual(streakName);
        expect(updatedSoloStreak.status).toEqual(StreakStatus.live);
        expect(updatedSoloStreak.streakDescription).toEqual(streakDescription);
        expect(updatedSoloStreak.userId).toEqual(userId);
        expect(updatedSoloStreak.completedToday).toEqual(false);
        expect(updatedSoloStreak.active).toEqual(false);
        expect(updatedSoloStreak.pastStreaks.length).toEqual(1);
        const pastStreak = updatedSoloStreak.pastStreaks[0];
        expect(pastStreak.endDate).toEqual(expect.any(String));
        expect(pastStreak.numberOfDaysInARow).toEqual(1);
        expect(pastStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(pastStreak).sort()).toEqual(['endDate', 'numberOfDaysInARow', 'startDate'].sort());
        expect(updatedSoloStreak.timezone).toEqual(expect.any(String));
        const currentStreak = updatedSoloStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(0);
        expect(currentStreak.startDate).toEqual(null);
        expect(Object.keys(currentStreak)).toEqual(['startDate', 'numberOfDaysInARow']);
        expect(updatedSoloStreak._id).toEqual(expect.any(String));
        expect(updatedSoloStreak.createdAt).toEqual(expect.any(String));
        expect(updatedSoloStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedSoloStreak).sort()).toEqual(
            [
                '_id',
                'status',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'streakName',
                'streakDescription',
                'userId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const lostStreakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
            userId,
            streakId: lostSoloStreakId,
            type: StreakTrackingEventTypes.lostStreak,
        });
        const lostStreakTrackingEvent = lostStreakTrackingEvents[0];

        expect(lostStreakTrackingEvent.type).toEqual(StreakTrackingEventTypes.lostStreak);
        expect(lostStreakTrackingEvent.streakId).toEqual(lostSoloStreakId);
        expect(lostStreakTrackingEvent.streakType).toEqual(StreakTypes.solo);
        expect(lostStreakTrackingEvent.userId).toEqual(userId);
        expect(lostStreakTrackingEvent._id).toEqual(expect.any(String));
        expect(lostStreakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(lostStreakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(lostStreakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });

    test('manages inactive streaks correctly', async () => {
        expect.assertions(22);

        const timezone = 'Europe/London';
        const streakName = 'Singing';
        const streakDescription = 'Everyday we must do 20 minutes of singing';

        const inactiveSoloStreak = await streakoid.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });
        const inactiveSoloStreakId = inactiveSoloStreak._id;

        const job = await createSoloStreakDailyTrackerJob(timezone);

        await job.run();

        const updatedSoloStreak = await streakoid.soloStreaks.getOne(inactiveSoloStreakId);

        expect(updatedSoloStreak.streakName).toEqual(streakName);
        expect(updatedSoloStreak.status).toEqual(StreakStatus.live);
        expect(updatedSoloStreak.streakDescription).toEqual(streakDescription);
        expect(updatedSoloStreak.userId).toEqual(userId);
        expect(updatedSoloStreak.completedToday).toEqual(false);
        expect(updatedSoloStreak.active).toEqual(false);
        expect(updatedSoloStreak.pastStreaks.length).toEqual(0);
        expect(updatedSoloStreak.timezone).toEqual(expect.any(String));
        const currentStreak = updatedSoloStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(currentStreak)).toEqual(['numberOfDaysInARow']);
        expect(updatedSoloStreak._id).toEqual(expect.any(String));
        expect(updatedSoloStreak.createdAt).toEqual(expect.any(String));
        expect(updatedSoloStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedSoloStreak).sort()).toEqual(
            [
                '_id',
                'status',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'streakName',
                'streakDescription',
                'userId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const streakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
            userId,
            streakId: inactiveSoloStreakId,
        });
        const streakTrackingEvent = streakTrackingEvents[0];

        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.inactiveStreak);
        expect(streakTrackingEvent.userId).toBeDefined();
        expect(streakTrackingEvent.streakId).toBeDefined();
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.solo);
        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });
});
