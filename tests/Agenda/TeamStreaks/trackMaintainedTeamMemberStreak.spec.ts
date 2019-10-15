import streakoid from '.../../../src/streakoid';

import { StreakTrackingEventTypes, StreakTypes } from '@streakoid/streakoid-sdk/lib';
import { trackMaintainedTeamMemberStreaks } from '../../../src/Agenda/TeamStreaks/trackMaintainedTeamMemberStreaks';
import { londonTimezone } from '@streakoid/streakoid-sdk/lib/streakoid';

const username = 'trackmaintainedteammemberstreakusername';
const email = 'trackMaintainedteammemberStreak@gmail.com';

jest.setTimeout(120000);

describe('trackMaintainedTeamMemberStreak', () => {
    let userId: string;
    let teamStreakId: string;
    let teamMemberStreakId: string;

    const streakName = 'Daily Programming';
    const streakDescription = 'I will program for one hour everyday';

    beforeAll(async () => {
        const user = await streakoid.users.create({
            username,
            email,
        });
        userId = user._id;
        const members = [{ memberId: userId }];

        const teamStreak = await streakoid.teamStreaks.create({
            creatorId: userId,
            streakName,
            streakDescription,
            members,
        });
        teamStreakId = teamStreak._id;

        const teamMemberStreak = await streakoid.teamMemberStreaks.create({
            userId,
            teamStreakId,
        });
        teamMemberStreakId = teamMemberStreak._id;
    });

    test('updates teamMember streak activity and creates a streak maintained tracking event', async () => {
        expect.assertions(31);

        const completeTeamMemberStreakTask = await streakoid.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId,
            teamMemberStreakId: teamMemberStreakId,
            streakType: StreakTypes.teamMember,
        });

        expect(completeTeamMemberStreakTask._id).toBeDefined();
        expect(completeTeamMemberStreakTask.teamMemberStreakId).toEqual(teamMemberStreakId);
        expect(completeTeamMemberStreakTask.teamStreakId).toEqual(teamStreakId);
        expect(completeTeamMemberStreakTask.streakType).toEqual(StreakTypes.teamMember);
        expect(completeTeamMemberStreakTask.userId).toEqual(userId);
        expect(completeTeamMemberStreakTask.taskCompleteTime).toEqual(expect.any(String));
        expect(completeTeamMemberStreakTask.taskCompleteDay).toEqual(expect.any(String));
        expect(completeTeamMemberStreakTask.createdAt).toEqual(expect.any(String));
        expect(completeTeamMemberStreakTask.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(completeTeamMemberStreakTask).sort()).toEqual(
            [
                '_id',
                'teamMemberStreakId',
                'teamStreakId',
                'streakType',
                'taskCompleteTime',
                'taskCompleteDay',
                'createdAt',
                'updatedAt',
                'userId',
                '__v',
            ].sort(),
        );

        const maintainedTeamMemberStreaks = await streakoid.teamMemberStreaks.getAll({
            completedToday: true,
        });

        await trackMaintainedTeamMemberStreaks(maintainedTeamMemberStreaks);

        const teamMemberStreak = await streakoid.teamMemberStreaks.getOne(teamMemberStreakId);

        expect(teamMemberStreak._id).toEqual(expect.any(String));
        expect(teamMemberStreak.currentStreak.startDate).toEqual(expect.any(String));
        expect(teamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(1);
        expect(Object.keys(teamMemberStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow', 'startDate'].sort());
        expect(teamMemberStreak.completedToday).toEqual(false);
        expect(teamMemberStreak.active).toEqual(true);
        expect(teamMemberStreak.pastStreaks).toEqual([]);
        expect(teamMemberStreak.userId).toEqual(expect.any(String));
        expect(teamMemberStreak.teamStreakId).toEqual(teamStreakId);
        expect(teamMemberStreak.timezone).toEqual(londonTimezone);
        expect(teamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(teamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak).sort()).toEqual(
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

        const streakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
            streakId: teamMemberStreakId,
        });
        const streakTrackingEvent = streakTrackingEvents[0];

        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.maintainedStreak);
        expect(streakTrackingEvent.streakId).toBeDefined();
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.teamMember);
        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.userId).toEqual(userId);
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });
});
