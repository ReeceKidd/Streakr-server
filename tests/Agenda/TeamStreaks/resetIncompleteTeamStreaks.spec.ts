import streakoid from '../../../src/streakoid';

import { resetIncompleteTeamStreaks } from '../../../src/Agenda/TeamStreaks/resetIncompleteTeamStreaks';
import StreakStatus from '@streakoid/streakoid-sdk/lib/StreakStatus';
import { StreakTrackingEventTypes, StreakTypes } from '@streakoid/streakoid-sdk/lib';

const username = 'resetIncompleteTeamStreaksUsername';
const email = 'resetIncompleteTeamStreaks@gmail.com';

jest.setTimeout(120000);

describe('resetIncompleteTeamStreaks', () => {
    let userId: string;
    let teamStreakId: string;
    let streakTrackingEventId: string;
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

    afterAll(async () => {
        await streakoid.users.deleteOne(userId);
        await streakoid.teamStreaks.deleteOne(teamStreakId);
        await streakoid.streakTrackingEvents.deleteOne(streakTrackingEventId);
    });

    test('adds current streak to past streak,  resets the current streak and creats a lost streak tracking event.', async () => {
        expect.assertions(27);

        console.log(`UserId: ${userId}`);
        console.log(`Team streak Id: ${teamStreakId}`);

        try {
            const incompleteTeamStreaks = await streakoid.teamStreaks.getAll({
                completedToday: false,
            });

            console.log(1);

            const endDate = new Date();
            await resetIncompleteTeamStreaks(incompleteTeamStreaks, endDate.toString());

            const updatedTeamStreak = await streakoid.teamStreaks.getOne(teamStreakId);

            console.log(2);

            expect(updatedTeamStreak.streakName).toEqual(streakName);
            expect(updatedTeamStreak.status).toEqual(StreakStatus.live);
            expect(updatedTeamStreak.streakDescription).toEqual(streakDescription);
            expect(updatedTeamStreak.completedToday).toEqual(false);
            expect(updatedTeamStreak.active).toEqual(false);
            expect(updatedTeamStreak.pastStreaks.length).toEqual(1);
            const pastStreak = updatedTeamStreak.pastStreaks[0];
            expect(pastStreak.endDate).toEqual(expect.any(String));
            expect(pastStreak.numberOfDaysInARow).toEqual(0);
            expect(pastStreak.startDate).toEqual(expect.any(String));
            expect(Object.keys(pastStreak).sort()).toEqual(['endDate', 'numberOfDaysInARow', 'startDate'].sort());
            expect(updatedTeamStreak.timezone).toEqual(expect.any(String));
            const currentStreak = updatedTeamStreak.currentStreak;
            expect(currentStreak.numberOfDaysInARow).toEqual(0);
            expect(currentStreak.startDate).toEqual(null);
            expect(Object.keys(currentStreak)).toEqual(['startDate', 'numberOfDaysInARow']);
            expect(updatedTeamStreak._id).toEqual(expect.any(String));
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
                    'userId',
                    'timezone',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );

            const streakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
                userId,
            });
            const streakTrackingEvent = streakTrackingEvents[0];
            streakTrackingEventId = streakTrackingEvent._id;

            expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.lostStreak);
            expect(streakTrackingEvent.userId).toBeDefined();
            expect(streakTrackingEvent.streakId).toBeDefined();
            expect(streakTrackingEvent.streakType).toEqual(StreakTypes.team);
            expect(streakTrackingEvent._id).toEqual(expect.any(String));
            expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
            expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
            expect(Object.keys(streakTrackingEvent).sort()).toEqual(
                ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
            );
        } catch (err) {
            console.log(err.response.data);
        }
    });
});
