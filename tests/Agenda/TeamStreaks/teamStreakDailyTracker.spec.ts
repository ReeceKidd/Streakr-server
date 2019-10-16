/* eslint-disable @typescript-eslint/no-explicit-any */
import streakoid from '../../../src/streakoid';
import { createTeamStreakDailyTrackerJob } from '../../../src/scripts/initaliseTeamStreakTimezoneCheckers';
import { StreakTypes, StreakStatus, StreakTrackingEventTypes } from '@streakoid/streakoid-sdk/lib';
import { londonTimezone } from '@streakoid/streakoid-sdk/lib/streakoid';

const username = 'solo-streak-daily-tracker-name';
const email = 'solostreaktracker@gmail.com';

jest.setTimeout(120000);

describe('soloStreakDailyTracker', () => {
    let userId: string;

    beforeAll(async () => {
        const user = await streakoid.users.create({ username, email });
        userId = user._id;
    });

    test('initialises teamStreakDailyTracker job correctly', async () => {
        expect.assertions(10);
        const timezone = 'Europe/London';
        const job = await createTeamStreakDailyTrackerJob(timezone);
        const { attrs } = job as any;
        const { name, data, type, priority, nextRunAt, _id, repeatInterval, repeatTimezone } = attrs;
        expect(name).toEqual('teamStreakDailyTracker');
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

    test.only('maintains team streaks correctly when a lone user has completed their task', async () => {
        expect.assertions(31);

        const timezone = 'Europe/London';

        const streakName = 'Painting';
        const streakDescription = 'Everyday we must paint for 30 minutes';

        const creatorId = userId;
        const members = [{ memberId: userId }];

        const teamStreak = await streakoid.teamStreaks.create({
            creatorId,
            streakName,
            streakDescription,
            members,
        });

        console.log('Original');
        console.log(teamStreak);

        const teamMemberStreaks = await streakoid.teamMemberStreaks.getAll({
            userId,
            teamStreakId: teamStreak._id,
        });
        const teamMemberStreak = teamMemberStreaks[0];

        const completeTeamMemberStreak = await streakoid.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId: teamStreak._id,
            teamMemberStreakId: teamMemberStreak._id,
        });

        console.log(completeTeamMemberStreak);

        const job = await createTeamStreakDailyTrackerJob(timezone);

        await job.run();

        console.log('Updated');

        const updatedTeamStreak = await streakoid.teamStreaks.getOne(teamStreak._id);

        console.log(updatedTeamStreak);

        expect(updatedTeamStreak.streakName).toEqual(streakName);
        expect(updatedTeamStreak.status).toEqual(StreakStatus.live);
        expect(updatedTeamStreak.streakDescription).toEqual(streakDescription);
        expect(updatedTeamStreak.completedToday).toEqual(false);
        expect(updatedTeamStreak.active).toEqual(true);
        expect(updatedTeamStreak.pastStreaks.length).toEqual(0);
        expect(updatedTeamStreak.timezone).toEqual(expect.any(String));

        const currentStreak = updatedTeamStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(1);
        expect(currentStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(currentStreak).sort()).toEqual(['numberOfDaysInARow', 'startDate'].sort());

        expect(updatedTeamStreak._id).toEqual(expect.any(String));
        expect(updatedTeamStreak.creatorId).toEqual(expect.any(String));
        expect(updatedTeamStreak.creator._id).toEqual(userId);
        expect(updatedTeamStreak.creator.username).toEqual(username);
        expect(Object.keys(updatedTeamStreak.creator).sort()).toEqual(['_id', 'username'].sort());
        expect(updatedTeamStreak.members.length).toEqual(1);

        const member = updatedTeamStreak.members[0];
        expect(member._id).toEqual(userId);
        expect(member.teamMemberStreak).toEqual(expect.any(Object));
        expect(member.username).toEqual(username);
        expect(Object.keys(member).sort()).toEqual(['_id', 'teamMemberStreak', 'username'].sort());
        expect(updatedTeamStreak.createdAt).toEqual(expect.any(String));
        expect(updatedTeamStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedTeamStreak).sort()).toEqual(
            [
                '_id',
                'status',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'streakName',
                'streakDescription',
                'timezone',
                'creator',
                'creatorId',
                'members',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const teamStreakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
            streakId: teamStreak._id,
        });
        const teamStreakTrackingEvent = teamStreakTrackingEvents[0];

        expect(teamStreakTrackingEvent.type).toEqual(StreakTrackingEventTypes.maintainedStreak);
        expect(teamStreakTrackingEvent.streakId).toEqual(teamStreak._id);
        expect(teamStreakTrackingEvent.streakType).toEqual(StreakTypes.team);
        expect(teamStreakTrackingEvent._id).toEqual(expect.any(String));
        expect(teamStreakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(teamStreakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamStreakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        const updatedTeamMemberStreak = await streakoid.teamMemberStreaks.getOne(teamMemberStreak._id);

        expect(updatedTeamMemberStreak._id).toEqual(expect.any(String));
        expect(updatedTeamMemberStreak.currentStreak.startDate).toEqual(expect.any(String));
        expect(updatedTeamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(1);
        expect(Object.keys(updatedTeamMemberStreak.currentStreak).sort()).toEqual(
            ['numberOfDaysInARow', 'startDate'].sort(),
        );
        expect(updatedTeamMemberStreak.completedToday).toEqual(false);
        expect(updatedTeamMemberStreak.active).toEqual(true);
        expect(updatedTeamMemberStreak.pastStreaks).toEqual([]);
        expect(updatedTeamMemberStreak.userId).toEqual(expect.any(String));
        expect(updatedTeamMemberStreak.teamStreakId).toEqual(teamStreak._id);
        expect(updatedTeamMemberStreak.timezone).toEqual(londonTimezone);
        expect(updatedTeamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(updatedTeamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedTeamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const teamMemberStreakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
            streakId: teamStreak._id,
        });
        const teamMemberStreakTrackingEvent = teamMemberStreakTrackingEvents[0];

        expect(teamMemberStreakTrackingEvent.type).toEqual(StreakTrackingEventTypes.maintainedStreak);
        expect(teamMemberStreakTrackingEvent.streakId).toEqual(teamStreak._id);
        expect(teamMemberStreakTrackingEvent.streakType).toEqual(StreakTypes.team);
        expect(teamMemberStreakTrackingEvent.userId).toEqual(userId);
        expect(teamMemberStreakTrackingEvent._id).toEqual(expect.any(String));
        expect(teamMemberStreakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(teamMemberStreakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        expect(dailyJob._id).toEqual(expect.any(String));
        expect(dailyJob.agendaJobId).toEqual(agendaJobId);
        expect(dailyJob.jobName).toEqual(AgendaJobNames.soloStreakDailyTracker);
        expect(dailyJob.timezone).toEqual('Europe/London');
        expect(dailyJob.localisedJobCompleteTime).toEqual(localisedJobCompleteTime);
        expect(dailyJob.streakType).toEqual(StreakTypes.solo);
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

    // test('manages lost streaks correctly', async () => {
    //     expect.assertions(35);

    //     const timezone = 'Europe/London';

    //     const streakName = 'Stretching';
    //     const streakDescription = 'Everyday I must stretch for 30 minutes';

    //     const lostSoloStreak = await streakoid.soloStreaks.create({
    //         userId,
    //         streakName,
    //         streakDescription,
    //     });
    //     lostSoloStreakId = lostSoloStreak._id;

    //     const completeSoloStreakTask = await streakoid.completeSoloStreakTasks.create({
    //         userId,
    //         soloStreakId: lostSoloStreakId,
    //     });

    //     expect(completeSoloStreakTask._id).toBeDefined();
    //     expect(completeSoloStreakTask.userId).toEqual(userId);
    //     expect(completeSoloStreakTask.streakId).toEqual(lostSoloStreak._id);
    //     expect(completeSoloStreakTask.taskCompleteTime).toEqual(expect.any(String));
    //     expect(completeSoloStreakTask.taskCompleteDay).toEqual(expect.any(String));
    //     expect(completeSoloStreakTask.createdAt).toEqual(expect.any(String));
    //     expect(completeSoloStreakTask.updatedAt).toEqual(expect.any(String));
    //     expect(Object.keys(completeSoloStreakTask).sort()).toEqual(
    //         [
    //             '_id',
    //             'userId',
    //             'streakId',
    //             'taskCompleteTime',
    //             'taskCompleteDay',
    //             'createdAt',
    //             'updatedAt',
    //             '__v',
    //         ].sort(),
    //     );

    //     const job = await createSoloStreakDailyTrackerJob(timezone);

    //     await job.run();
    //     // Simulates an additional day passing
    //     await job.run();

    //     const updatedSoloStreak = await streakoid.soloStreaks.getOne(lostSoloStreakId);

    //     expect(updatedSoloStreak.streakName).toEqual(streakName);
    //     expect(updatedSoloStreak.status).toEqual(StreakStatus.live);
    //     expect(updatedSoloStreak.streakDescription).toEqual(streakDescription);
    //     expect(updatedSoloStreak.userId).toEqual(userId);
    //     expect(updatedSoloStreak.completedToday).toEqual(false);
    //     expect(updatedSoloStreak.active).toEqual(false);
    //     expect(updatedSoloStreak.pastStreaks.length).toEqual(1);
    //     const pastStreak = updatedSoloStreak.pastStreaks[0];
    //     expect(pastStreak.endDate).toEqual(expect.any(String));
    //     expect(pastStreak.numberOfDaysInARow).toEqual(1);
    //     expect(pastStreak.startDate).toEqual(expect.any(String));
    //     expect(Object.keys(pastStreak).sort()).toEqual(['endDate', 'numberOfDaysInARow', 'startDate'].sort());
    //     expect(updatedSoloStreak.timezone).toEqual(expect.any(String));
    //     const currentStreak = updatedSoloStreak.currentStreak;
    //     expect(currentStreak.numberOfDaysInARow).toEqual(0);
    //     expect(currentStreak.startDate).toEqual(null);
    //     expect(Object.keys(currentStreak)).toEqual(['startDate', 'numberOfDaysInARow']);
    //     expect(updatedSoloStreak._id).toEqual(expect.any(String));
    //     expect(updatedSoloStreak.createdAt).toEqual(expect.any(String));
    //     expect(updatedSoloStreak.updatedAt).toEqual(expect.any(String));
    //     expect(Object.keys(updatedSoloStreak).sort()).toEqual(
    //         [
    //             '_id',
    //             'status',
    //             'currentStreak',
    //             'completedToday',
    //             'active',
    //             'pastStreaks',
    //             'streakName',
    //             'streakDescription',
    //             'userId',
    //             'timezone',
    //             'createdAt',
    //             'updatedAt',
    //             '__v',
    //         ].sort(),
    //     );

    //     const lostStreakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
    //         userId,
    //         streakId: lostSoloStreakId,
    //         type: StreakTrackingEventTypes.lostStreak,
    //     });
    //     const lostStreakTrackingEvent = lostStreakTrackingEvents[0];

    //     expect(lostStreakTrackingEvent.type).toEqual(StreakTrackingEventTypes.lostStreak);
    //     expect(lostStreakTrackingEvent.streakId).toEqual(lostSoloStreakId);
    //     expect(lostStreakTrackingEvent.streakType).toEqual(StreakTypes.solo);
    //     expect(lostStreakTrackingEvent.userId).toEqual(userId);
    //     expect(lostStreakTrackingEvent._id).toEqual(expect.any(String));
    //     expect(lostStreakTrackingEvent.createdAt).toEqual(expect.any(String));
    //     expect(lostStreakTrackingEvent.updatedAt).toEqual(expect.any(String));
    //     expect(Object.keys(lostStreakTrackingEvent).sort()).toEqual(
    //         ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
    //     );

    //     lostSoloStreakAgendaJobId = String(job.attrs._id);
    //     lostStreakTrackingEventId = lostStreakTrackingEvent._id;
    // });

    // test('manages inactive streaks correctly', async () => {
    //     expect.assertions(22);

    //     const timezone = 'Europe/London';
    //     const streakName = 'Singing';
    //     const streakDescription = 'Everyday we must do 20 minutes of singing';

    //     const inactiveSoloStreak = await streakoid.soloStreaks.create({
    //         userId,
    //         streakName,
    //         streakDescription,
    //     });
    //     inactiveSoloStreakId = inactiveSoloStreak._id;

    //     const job = await createSoloStreakDailyTrackerJob(timezone);
    //     inactiveSoloStreakAgendaJobId = String(job.attrs._id);

    //     await job.run();

    //     const updatedSoloStreak = await streakoid.soloStreaks.getOne(inactiveSoloStreakId);

    //     expect(updatedSoloStreak.streakName).toEqual(streakName);
    //     expect(updatedSoloStreak.status).toEqual(StreakStatus.live);
    //     expect(updatedSoloStreak.streakDescription).toEqual(streakDescription);
    //     expect(updatedSoloStreak.userId).toEqual(userId);
    //     expect(updatedSoloStreak.completedToday).toEqual(false);
    //     expect(updatedSoloStreak.active).toEqual(false);
    //     expect(updatedSoloStreak.pastStreaks.length).toEqual(0);
    //     expect(updatedSoloStreak.timezone).toEqual(expect.any(String));
    //     const currentStreak = updatedSoloStreak.currentStreak;
    //     expect(currentStreak.numberOfDaysInARow).toEqual(0);
    //     expect(Object.keys(currentStreak)).toEqual(['numberOfDaysInARow']);
    //     expect(updatedSoloStreak._id).toEqual(expect.any(String));
    //     expect(updatedSoloStreak.createdAt).toEqual(expect.any(String));
    //     expect(updatedSoloStreak.updatedAt).toEqual(expect.any(String));
    //     expect(Object.keys(updatedSoloStreak).sort()).toEqual(
    //         [
    //             '_id',
    //             'status',
    //             'currentStreak',
    //             'completedToday',
    //             'active',
    //             'pastStreaks',
    //             'streakName',
    //             'streakDescription',
    //             'userId',
    //             'timezone',
    //             'createdAt',
    //             'updatedAt',
    //             '__v',
    //         ].sort(),
    //     );

    //     const streakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
    //         userId,
    //         streakId: inactiveSoloStreakId,
    //     });
    //     const streakTrackingEvent = streakTrackingEvents[0];
    //     inactiveStreakTrackingEventId = streakTrackingEvent._id;

    //     expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.inactiveStreak);
    //     expect(streakTrackingEvent.userId).toBeDefined();
    //     expect(streakTrackingEvent.streakId).toBeDefined();
    //     expect(streakTrackingEvent.streakType).toEqual(StreakTypes.solo);
    //     expect(streakTrackingEvent._id).toEqual(expect.any(String));
    //     expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
    //     expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
    //     expect(Object.keys(streakTrackingEvent).sort()).toEqual(
    //         ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
    //     );
    // });
});
