import streakoid from '.../../../src/streakoid';

import StreakStatus from '@streakoid/streakoid-sdk/lib/StreakStatus';
import { StreakTrackingEventTypes, StreakTypes } from '@streakoid/streakoid-sdk/lib';
import { trackMaintainedTeamStreaks } from '../../../src/Agenda/TeamStreaks/trackMaintainedTeamStreaks';

const username = 'trackmaintainedteamstreakusername';
const email = 'trackMaintainedteamStreak@gmail.com';

jest.setTimeout(120000);

describe('trackMaintainedTeamStreak', () => {
    let userId: string;
    let teamStreakId: string;

    const streakName = 'Daily Programming';
    const streakDescription = 'I will program for one hour everyday';

    beforeAll(async () => {
        const user = await streakoid.users.create({
            email,
            username,
        });
        userId = user._id;
        const creatorId = userId;
        const members = [{ memberId: userId }];

        const teamStreak = await streakoid.teamStreaks.create({
            creatorId,
            streakName,
            streakDescription,
            members,
        });
        teamStreakId = teamStreak._id;
    });

    test('updates team streak activity and creates a streak maintained tracking event', async () => {
        expect.assertions(37);

        const completeTeamStreakTask = await streakoid.completeTeamStreakTasks.create({
            teamStreakId,
        });

        expect(completeTeamStreakTask._id).toBeDefined();
        expect(completeTeamStreakTask.teamStreakId).toEqual(teamStreakId);
        expect(completeTeamStreakTask.taskCompleteTime).toEqual(expect.any(String));
        expect(completeTeamStreakTask.taskCompleteDay).toEqual(expect.any(String));
        expect(completeTeamStreakTask.createdAt).toEqual(expect.any(String));
        expect(completeTeamStreakTask.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(completeTeamStreakTask).sort()).toEqual(
            ['_id', 'teamStreakId', 'taskCompleteTime', 'taskCompleteDay', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        const maintainedTeamStreaks = await streakoid.teamStreaks.getAll({
            completedToday: true,
        });

        await trackMaintainedTeamStreaks(maintainedTeamStreaks);

        const updatedTeamStreak = await streakoid.teamStreaks.getOne(teamStreakId);

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

        const streakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
            streakId: teamStreakId,
        });
        const streakTrackingEvent = streakTrackingEvents[0];

        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.maintainedStreak);
        expect(streakTrackingEvent.streakId).toBeDefined();
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.team);
        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });
});
