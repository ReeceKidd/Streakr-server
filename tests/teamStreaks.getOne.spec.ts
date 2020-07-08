import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { correctTeamMemberStreakKeys } from '../src/testHelpers/correctTeamMemberStreakKeys';
import { correctPopulatedTeamStreakKeys } from '../src/testHelpers/correctPopulatedTeamStreakKeys';

jest.setTimeout(120000);

const testName = 'GET-team-streaks';

describe(testName, () => {
    let database: Mongoose;
    let SDK: StreakoidSDK;
    beforeAll(async () => {
        if (isTestEnvironment()) {
            database = await setupDatabase({ testName });
            SDK = streakoidTestSDK({ testName });
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

    test(`team streak can be retrieved with populated member information`, async () => {
        expect.assertions(20);

        const user = await getPayingUser({ testName });
        const creatorId = user._id;
        const members = [{ memberId: creatorId }];
        const streakName = 'Daily Spanish';

        const createdTeamStreak = await SDK.teamStreaks.create({
            creatorId,
            streakName,
            members,
        });

        const teamStreak = await SDK.teamStreaks.getOne(createdTeamStreak._id);

        expect(teamStreak.members.length).toEqual(1);
        const member = teamStreak.members[0];
        expect(member._id).toBeDefined();
        expect(member.username).toBeDefined();
        expect(member.profileImage).toBeDefined();
        expect(Object.keys(member).sort()).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak'].sort());

        const { teamMemberStreak } = member;
        expect(Object.keys(teamMemberStreak).sort()).toEqual(correctTeamMemberStreakKeys);

        expect(teamStreak.streakName).toEqual(streakName);
        expect(teamStreak.status).toEqual(StreakStatus.live);
        expect(teamStreak.creatorId).toBeDefined();
        expect(teamStreak.timezone).toBeDefined();
        expect(teamStreak.active).toEqual(false);
        expect(teamStreak.inviteKey).toBeUndefined();
        expect(teamStreak.completedToday).toEqual(false);
        expect(teamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(teamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(teamStreak.pastStreaks.length).toEqual(0);
        expect(Object.keys(teamStreak).sort()).toEqual(correctPopulatedTeamStreakKeys);

        const { creator } = teamStreak;
        expect(creator._id).toBeDefined();
        expect(creator.username).toBeDefined();
        expect(Object.keys(creator).sort()).toEqual(['_id', 'username'].sort());
    });

    test(`sends team streak does not exist error when solo streak doesn't exist`, async () => {
        expect.assertions(4);

        try {
            await getPayingUser({ testName });

            await SDK.teamStreaks.getOne('5d54487483233622e43270f9');
        } catch (err) {
            const error = JSON.parse(err.text);
            const { code, message } = error;
            expect(err.status).toEqual(400);
            expect(code).toEqual('400-25');
            expect(message).toEqual('Team streak does not exist.');
            expect(Object.keys(error).sort()).toEqual(['code', 'message', 'httpStatusCode'].sort());
        }
    });
});
