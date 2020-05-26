/* eslint-disable @typescript-eslint/no-explicit-any */
import { createChallengeStreakDailyTrackerJob } from '../../../src/scripts/initaliseChallengeStreakTimezoneCheckers';

import { isTestEnvironment } from '../../setup/isTestEnvironment';
import { getPayingUser } from '../../setup/getPayingUser';
import { setupDatabase } from '../../setup/setupDatabase';
import { tearDownDatabase } from '../../setup/tearDownDatabase';
import { testSDK } from '../../testSDK/testSDK';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import AgendaJobNames from '@streakoid/streakoid-models/lib/Types/AgendaJobNames';

jest.setTimeout(500000);

describe('challengeStreakDailyTracker', () => {
    beforeEach(async () => {
        if (isTestEnvironment()) {
            await setupDatabase();
        }
    });

    afterEach(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase();
        }
    });

    test('initializes challengeStreakDailyTracker job correctly', async () => {
        expect.assertions(10);

        const timezone = 'Europe/London';
        const job = await createChallengeStreakDailyTrackerJob(timezone);
        const { attrs } = job as any;
        const { name, data, type, priority, nextRunAt, _id, repeatInterval, repeatTimezone } = attrs;
        expect(name).toEqual('challengeStreakDailyTracker');
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
    });

    test('maintains streaks correctly', async () => {
        expect.assertions(42);

        const timezone = 'Europe/London';

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';

        const { challenge } = await testSDK.challenges.create({
            name,
            description,
            icon,
        });

        const user = await getPayingUser();
        const userId = user._id;

        const maintainedChallengeStreak = await testSDK.challengeStreaks.create({
            userId,
            challengeId: challenge._id,
        });

        const maintainedChallengeStreakId = maintainedChallengeStreak._id;

        const completeChallengeStreakTask = await testSDK.completeChallengeStreakTasks.create({
            userId,
            challengeStreakId: maintainedChallengeStreakId,
        });

        expect(completeChallengeStreakTask._id).toBeDefined();
        expect(completeChallengeStreakTask.userId).toEqual(expect.any(String));
        expect(completeChallengeStreakTask.challengeStreakId).toEqual(maintainedChallengeStreakId);
        expect(completeChallengeStreakTask.taskCompleteTime).toEqual(expect.any(String));
        expect(completeChallengeStreakTask.taskCompleteDay).toEqual(expect.any(String));
        expect(completeChallengeStreakTask.createdAt).toEqual(expect.any(String));
        expect(completeChallengeStreakTask.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(completeChallengeStreakTask).sort()).toEqual(
            [
                '_id',
                'userId',
                'challengeStreakId',
                'taskCompleteTime',
                'taskCompleteDay',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const job = await createChallengeStreakDailyTrackerJob(timezone);

        await job.run();

        const updatedChallengeStreak = await testSDK.challengeStreaks.getOne({
            challengeStreakId: maintainedChallengeStreakId,
        });

        expect(updatedChallengeStreak.status).toEqual(StreakStatus.live);
        expect(updatedChallengeStreak.userId).toEqual(expect.any(String));
        expect(updatedChallengeStreak.username).toEqual(user.username);
        expect(updatedChallengeStreak.userProfileImage).toEqual(user.profileImages.originalImageUrl);
        expect(updatedChallengeStreak.challengeId).toEqual(challenge._id);
        expect(updatedChallengeStreak.challengeName).toEqual(challenge.name);
        expect(updatedChallengeStreak.completedToday).toEqual(false);
        expect(updatedChallengeStreak.active).toEqual(true);
        expect(updatedChallengeStreak.pastStreaks.length).toEqual(0);
        expect(updatedChallengeStreak.timezone).toEqual(expect.any(String));
        const currentStreak = updatedChallengeStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(1);
        expect(currentStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(currentStreak)).toEqual(['startDate', 'numberOfDaysInARow']);
        expect(updatedChallengeStreak._id).toEqual(expect.any(String));
        expect(updatedChallengeStreak.createdAt).toEqual(expect.any(String));
        expect(updatedChallengeStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedChallengeStreak).sort()).toEqual(
            [
                '_id',
                'status',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'username',
                'userProfileImage',
                'challengeId',
                'challengeName',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const streakTrackingEvents = await testSDK.streakTrackingEvents.getAll({
            userId,
            streakId: maintainedChallengeStreakId,
        });
        const streakTrackingEvent = streakTrackingEvents[0];

        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.maintainedStreak);
        expect(streakTrackingEvent.streakId).toEqual(maintainedChallengeStreakId);
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.challenge);
        expect(streakTrackingEvent.userId).toEqual(expect.any(String));
        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        const agendaJobId = String(job.attrs._id);
        const dailyJobs = await testSDK.dailyJobs.getAll({ agendaJobId });
        const dailyJob = dailyJobs[0];

        expect(dailyJob._id).toEqual(expect.any(String));
        expect(dailyJob.agendaJobId).toEqual(agendaJobId);
        expect(dailyJob.jobName).toEqual(AgendaJobNames.challengeStreakDailyTracker);
        expect(dailyJob.timezone).toEqual('Europe/London');
        expect(dailyJob.localisedJobCompleteTime).toEqual(expect.any(String));
        expect(dailyJob.streakType).toEqual(StreakTypes.challenge);
        expect(dailyJob.createdAt).toEqual(expect.any(String));
        expect(dailyJob.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(dailyJob).sort()).toEqual(
            [
                '_id',
                'agendaJobId',
                'jobName',
                'timezone',
                'localisedJobCompleteTime',
                'streakType',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test('manages lost streaks correctly', async () => {
        expect.assertions(42);

        const timezone = 'Europe/London';

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';

        const { challenge } = await testSDK.challenges.create({
            name,
            description,
            icon,
        });

        const user = await getPayingUser();
        const userId = user._id;

        const lostChallengeStreak = await testSDK.challengeStreaks.create({
            userId,
            challengeId: challenge._id,
        });
        const lostChallengeStreakId = lostChallengeStreak._id;

        const completeChallengeStreakTask = await testSDK.completeChallengeStreakTasks.create({
            userId,
            challengeStreakId: lostChallengeStreakId,
        });

        expect(completeChallengeStreakTask._id).toBeDefined();
        expect(completeChallengeStreakTask.userId).toEqual(expect.any(String));
        expect(completeChallengeStreakTask.challengeStreakId).toEqual(lostChallengeStreak._id);
        expect(completeChallengeStreakTask.taskCompleteTime).toEqual(expect.any(String));
        expect(completeChallengeStreakTask.taskCompleteDay).toEqual(expect.any(String));
        expect(completeChallengeStreakTask.createdAt).toEqual(expect.any(String));
        expect(completeChallengeStreakTask.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(completeChallengeStreakTask).sort()).toEqual(
            [
                '_id',
                'userId',
                'challengeStreakId',
                'taskCompleteTime',
                'taskCompleteDay',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const job = await createChallengeStreakDailyTrackerJob(timezone);

        await job.run();
        // Simulates an additional day passing
        await job.run();

        const updatedChallengeStreak = await testSDK.challengeStreaks.getOne({
            challengeStreakId: lostChallengeStreakId,
        });

        expect(updatedChallengeStreak.status).toEqual(StreakStatus.live);
        expect(updatedChallengeStreak.userId).toEqual(expect.any(String));
        expect(updatedChallengeStreak.completedToday).toEqual(false);
        expect(updatedChallengeStreak.active).toEqual(false);
        expect(updatedChallengeStreak.pastStreaks.length).toEqual(1);
        const pastStreak = updatedChallengeStreak.pastStreaks[0];
        expect(pastStreak.endDate).toEqual(expect.any(String));
        expect(pastStreak.numberOfDaysInARow).toEqual(1);
        expect(pastStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(pastStreak).sort()).toEqual(['endDate', 'numberOfDaysInARow', 'startDate'].sort());
        expect(updatedChallengeStreak.timezone).toEqual(expect.any(String));
        const currentStreak = updatedChallengeStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(0);
        expect(currentStreak.startDate).toEqual(null);
        expect(Object.keys(currentStreak)).toEqual(['startDate', 'numberOfDaysInARow']);
        expect(updatedChallengeStreak._id).toEqual(expect.any(String));
        expect(updatedChallengeStreak.createdAt).toEqual(expect.any(String));
        expect(updatedChallengeStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedChallengeStreak).sort()).toEqual(
            [
                '_id',
                'status',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'username',
                'userProfileImage',
                'challengeId',
                'challengeName',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const lostStreakTrackingEvents = await testSDK.streakTrackingEvents.getAll({
            userId,
            streakId: lostChallengeStreakId,
            type: StreakTrackingEventTypes.lostStreak,
        });
        const lostStreakTrackingEvent = lostStreakTrackingEvents[0];

        expect(lostStreakTrackingEvent.type).toEqual(StreakTrackingEventTypes.lostStreak);
        expect(lostStreakTrackingEvent.streakId).toEqual(lostChallengeStreakId);
        expect(lostStreakTrackingEvent.streakType).toEqual(StreakTypes.challenge);
        expect(lostStreakTrackingEvent.userId).toEqual(expect.any(String));
        expect(lostStreakTrackingEvent._id).toEqual(expect.any(String));
        expect(lostStreakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(lostStreakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(lostStreakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        const agendaJobId = String(job.attrs._id);
        const dailyJobs = await testSDK.dailyJobs.getAll({ agendaJobId });
        const dailyJob = dailyJobs[0];

        expect(dailyJob._id).toEqual(expect.any(String));
        expect(dailyJob.agendaJobId).toEqual(agendaJobId);
        expect(dailyJob.jobName).toEqual(AgendaJobNames.challengeStreakDailyTracker);
        expect(dailyJob.timezone).toEqual('Europe/London');
        expect(dailyJob.localisedJobCompleteTime).toEqual(expect.any(String));
        expect(dailyJob.streakType).toEqual(StreakTypes.challenge);
        expect(dailyJob.createdAt).toEqual(expect.any(String));
        expect(dailyJob.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(dailyJob).sort()).toEqual(
            [
                '_id',
                'agendaJobId',
                'jobName',
                'timezone',
                'localisedJobCompleteTime',
                'streakType',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test('manages inactive streaks correctly', async () => {
        expect.assertions(29);

        const timezone = 'Europe/London';

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';

        const { challenge } = await testSDK.challenges.create({
            name,
            description,
            icon,
        });

        const user = await getPayingUser();
        const userId = user._id;

        const inactiveChallengeStreak = await testSDK.challengeStreaks.create({
            userId,
            challengeId: challenge._id,
        });
        const inactiveChallengeStreakId = inactiveChallengeStreak._id;

        const job = await createChallengeStreakDailyTrackerJob(timezone);

        await job.run();

        const updatedChallengeStreak = await testSDK.challengeStreaks.getOne({
            challengeStreakId: inactiveChallengeStreakId,
        });

        expect(updatedChallengeStreak.status).toEqual(StreakStatus.live);
        expect(updatedChallengeStreak.userId).toEqual(expect.any(String));
        expect(updatedChallengeStreak.completedToday).toEqual(false);
        expect(updatedChallengeStreak.active).toEqual(false);
        expect(updatedChallengeStreak.pastStreaks.length).toEqual(0);
        expect(updatedChallengeStreak.timezone).toEqual(expect.any(String));
        const currentStreak = updatedChallengeStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(currentStreak)).toEqual(['numberOfDaysInARow']);
        expect(updatedChallengeStreak._id).toEqual(expect.any(String));
        expect(updatedChallengeStreak.createdAt).toEqual(expect.any(String));
        expect(updatedChallengeStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedChallengeStreak).sort()).toEqual(
            [
                '_id',
                'status',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'username',
                'userProfileImage',
                'challengeId',
                'challengeName',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const streakTrackingEvents = await testSDK.streakTrackingEvents.getAll({
            userId,
            streakId: inactiveChallengeStreakId,
        });
        const streakTrackingEvent = streakTrackingEvents[0];

        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.inactiveStreak);
        expect(streakTrackingEvent.userId).toBeDefined();
        expect(streakTrackingEvent.streakId).toBeDefined();
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.challenge);
        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        const agendaJobId = String(job.attrs._id);
        const dailyJobs = await testSDK.dailyJobs.getAll({ agendaJobId });
        const dailyJob = dailyJobs[0];

        expect(dailyJob._id).toEqual(expect.any(String));
        expect(dailyJob.agendaJobId).toEqual(agendaJobId);
        expect(dailyJob.jobName).toEqual(AgendaJobNames.challengeStreakDailyTracker);
        expect(dailyJob.timezone).toEqual('Europe/London');
        expect(dailyJob.localisedJobCompleteTime).toEqual(expect.any(String));
        expect(dailyJob.streakType).toEqual(StreakTypes.challenge);
        expect(dailyJob.createdAt).toEqual(expect.any(String));
        expect(dailyJob.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(dailyJob).sort()).toEqual(
            [
                '_id',
                'agendaJobId',
                'jobName',
                'timezone',
                'localisedJobCompleteTime',
                'streakType',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });
});
