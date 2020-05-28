import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '../src/SDK/streakoidSDKFactory';
import { streakoidTestSDKFactory } from '../src/SDK/streakoidTestSDKFactory';
import { disconnectDatabase } from './setup/disconnectDatabase';

jest.setTimeout(120000);

const testName = 'GET-team-member-streak-id';

describe(testName, () => {
    let database: Mongoose;
    let SDK: StreakoidSDK;
    beforeAll(async () => {
        if (isTestEnvironment()) {
            database = await setupDatabase({ testName });
            SDK = streakoidTestSDKFactory({ testName });
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

    test(`team member streak can be retrieved`, async () => {
        expect.assertions(12);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const members = [{ memberId: userId }];
        const streakName = 'Daily Spanish';
        const teamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });
        const teamStreakId = teamStreak._id;

        const createdTeamMemberStreak = await SDK.teamMemberStreaks.create({
            userId,
            teamStreakId,
        });
        const teamMemberStreakId = createdTeamMemberStreak._id;

        const teamMemberStreak = await SDK.teamMemberStreaks.getOne(teamMemberStreakId);

        expect(teamMemberStreak._id).toEqual(expect.any(String));
        expect(teamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(teamMemberStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(teamMemberStreak.completedToday).toEqual(false);
        expect(teamMemberStreak.active).toEqual(false);
        expect(teamMemberStreak.pastStreaks).toEqual([]);
        expect(teamMemberStreak.userId).toEqual(expect.any(String));
        expect(teamMemberStreak.teamStreakId).toEqual(teamStreakId);
        expect(teamMemberStreak.timezone).toBeDefined();
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
    });

    test(`sends team member streak does not exist error when team member streak doesn't exist`, async () => {
        expect.assertions(4);

        try {
            const user = await getPayingUser({ testName });
            const userId = user._id;
            const members = [{ memberId: userId }];
            const streakName = 'Daily Spanish';
            const teamStreak = await SDK.teamStreaks.create({
                creatorId: userId,
                streakName,
                members,
            });
            const teamStreakId = teamStreak._id;

            await SDK.teamMemberStreaks.create({
                userId,
                teamStreakId,
            });
            await SDK.teamMemberStreaks.getOne('5d54487483233622e43270f9');
        } catch (err) {
            const error = JSON.parse(err.text);
            const { code, message } = error;
            expect(err.status).toEqual(400);
            expect(code).toEqual('400-34');
            expect(message).toEqual('Team member streak does not exist.');
            expect(Object.keys(error).sort()).toEqual(['code', 'message', 'httpStatusCode'].sort());
        }
    });
});
