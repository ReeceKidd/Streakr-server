import mongoose from 'mongoose';

import streakoid from '../../../src/streakoid';

import StreakStatus from '@streakoid/streakoid-sdk/lib/StreakStatus';
import { StreakTrackingEventTypes, StreakTypes } from '@streakoid/streakoid-sdk/lib';
import { resetIncompleteTeamMemberStreaks } from '../../../src/Agenda/TeamStreaks/resetIncompleteTeamMemberStreaks';
import { resetIncompleteTeamStreaks } from '../../../src/Agenda/TeamStreaks/resetIncompleteTeamStreaks';
import { getServiceConfig } from '../../../src/getServiceConfig';
import { originalImageUrl } from '../../../src/Models/User';

const { TEST_DATABASE_URI, NODE_ENV } = getServiceConfig();

const username = 'resetincompleteteammemberstreaksusername';
const email = 'resetIncompleteTeamMemberStreaks@gmail.com';

jest.setTimeout(120000);

describe('resetIncompleteTeamMemberStreaks', () => {
    let userId: string;
    const streakName = 'Daily Spanish';

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

    test('adds current team member streak to past streak, resets the current streak and creats a lost streak tracking event. Sets teamStreak completedToday to false', async () => {
        expect.assertions(34);

        const creatorId = userId;
        const members = [{ memberId: userId }];
        const teamStreak = await streakoid.teamStreaks.create({ creatorId, streakName, members });
        const teamStreakId = teamStreak._id;

        //Emulate team streak being active so the incomplete team member streak can reset it.
        await streakoid.teamStreaks.update({
            teamStreakId,
            updateData: { active: true, currentStreak: { startDate: new Date().toString(), numberOfDaysInARow: 1 } },
        });

        const teamMemberStreaks = await streakoid.teamMemberStreaks.getAll({
            userId,
            teamStreakId,
        });
        const teamMemberStreak = teamMemberStreaks[0];
        const teamMemberStreakId = teamMemberStreak._id;

        // Emulate team member streak being active
        await streakoid.teamMemberStreaks.update({
            teamMemberStreakId: teamMemberStreakId,
            updateData: { active: true, currentStreak: { startDate: new Date().toString(), numberOfDaysInARow: 1 } },
        });

        const incompleteTeamMemberStreaks = await streakoid.teamMemberStreaks.getAll({
            completedToday: false,
            active: true,
        });

        const endDate = new Date();

        await resetIncompleteTeamMemberStreaks(incompleteTeamMemberStreaks, endDate.toString());

        const incompleteTeamStreaks = await streakoid.teamStreaks.getAll({
            completedToday: false,
            active: true,
        });

        await resetIncompleteTeamStreaks(incompleteTeamStreaks, endDate.toString());

        const updatedTeamStreak = await streakoid.teamStreaks.getOne(teamStreakId);

        expect(updatedTeamStreak.streakName).toEqual(streakName);
        expect(updatedTeamStreak.status).toEqual(StreakStatus.live);
        expect(updatedTeamStreak.completedToday).toEqual(false);
        expect(updatedTeamStreak.active).toEqual(false);
        expect(updatedTeamStreak.pastStreaks.length).toEqual(1);
        const pastStreak = updatedTeamStreak.pastStreaks[0];
        expect(pastStreak.endDate).toEqual(expect.any(String));
        expect(pastStreak.numberOfDaysInARow).toEqual(1);
        expect(pastStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(pastStreak).sort()).toEqual(['endDate', 'numberOfDaysInARow', 'startDate'].sort());
        const currentStreak = updatedTeamStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(0);
        expect(currentStreak.startDate).toEqual(null);
        expect(Object.keys(currentStreak)).toEqual(['startDate', 'numberOfDaysInARow']);
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
        expect(member.profileImage).toEqual(originalImageUrl);
        expect(Object.keys(member).sort()).toEqual(['_id', 'teamMemberStreak', 'profileImage', 'username'].sort());
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
            streakId: teamMemberStreakId,
        });
        const streakTrackingEvent = streakTrackingEvents[0];

        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.lostStreak);
        expect(streakTrackingEvent.streakId).toBeDefined();
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.teamMember);
        expect(streakTrackingEvent.userId).toEqual(userId);
        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });
});
