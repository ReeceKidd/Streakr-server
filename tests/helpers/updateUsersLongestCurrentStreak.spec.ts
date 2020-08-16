import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { UserStreakHelper } from '../../src/helpers/UserStreakHelper';
import { isTestEnvironment } from '../setup/isTestEnvironment';
import { setupDatabase } from '../setup/setupDatabase';
import { streakoidTestSDK } from '../setup/streakoidTestSDK';
import { tearDownDatabase } from '../setup/tearDownDatabase';
import { disconnectDatabase } from '../setup/disconnectDatabase';
import { getPayingUser } from '../setup/getPayingUser';
import { LongestCurrentSoloStreak } from '@streakoid/streakoid-models/lib/Models/LongestCurrentSoloStreak';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { LongestCurrentChallengeStreak } from '@streakoid/streakoid-models/lib/Models/LongestCurrentChallengeStreak';
import { LongestCurrentTeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/LongestCurrentTeamMemberStreak';

jest.setTimeout(120000);

const testName = 'update-users-longest-current-streak';

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

    test(`if users longest current streak is a solo streak set the users longestCurrentStreak to the solo streak.`, async () => {
        expect.assertions(5);

        const user = await getPayingUser({ testName });

        const streakName = 'Daily Spanish';

        const soloStreak = await SDK.soloStreaks.create({
            userId: user._id,
            streakName,
        });

        const creatorId = user._id;
        const members = [{ memberId: creatorId }];

        await SDK.teamStreaks.create({
            creatorId,
            streakName,
            members,
        });

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        const { challenge } = await SDK.challenges.create({
            name,
            description,
            icon,
        });

        await SDK.challengeStreaks.create({
            userId: user._id,
            challengeId: challenge._id,
        });

        await SDK.completeSoloStreakTasks.create({ userId: user._id, soloStreakId: soloStreak._id });

        await UserStreakHelper.updateUsersLongestCurrentStreak({ userId: user._id });

        const updatedUser = await SDK.user.getCurrentUser();

        const longestCurrentStreak = updatedUser.longestCurrentStreak as LongestCurrentSoloStreak;

        expect(longestCurrentStreak.soloStreakId).toEqual(String(soloStreak._id));
        expect(longestCurrentStreak.soloStreakName).toEqual(soloStreak.streakName);
        expect(longestCurrentStreak.numberOfDays).toEqual(soloStreak.currentStreak.numberOfDaysInARow + 1);
        expect(longestCurrentStreak.startDate).toBeDefined();
        expect(longestCurrentStreak.streakType).toEqual(StreakTypes.solo);
    });

    test(`if users longest current streak is a challenge streak set the users longestCurrentStreak to the challenge streak.`, async () => {
        expect.assertions(6);

        const user = await getPayingUser({ testName });

        const streakName = 'Daily Spanish';

        await SDK.soloStreaks.create({
            userId: user._id,
            streakName,
        });

        const creatorId = user._id;
        const members = [{ memberId: creatorId }];

        await SDK.teamStreaks.create({
            creatorId,
            streakName,
            members,
        });

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        const { challenge } = await SDK.challenges.create({
            name,
            description,
            icon,
        });

        const challengeStreak = await SDK.challengeStreaks.create({
            userId: user._id,
            challengeId: challenge._id,
        });

        await SDK.completeChallengeStreakTasks.create({ userId: user._id, challengeStreakId: challengeStreak._id });

        await UserStreakHelper.updateUsersLongestCurrentStreak({ userId: user._id });

        const updatedUser = await SDK.user.getCurrentUser();

        const longestCurrentStreak = updatedUser.longestCurrentStreak as LongestCurrentChallengeStreak;

        expect(longestCurrentStreak.challengeStreakId).toEqual(String(challengeStreak._id));
        expect(longestCurrentStreak.challengeId).toEqual(challenge._id);
        expect(longestCurrentStreak.challengeName).toEqual(challenge.name);
        expect(longestCurrentStreak.numberOfDays).toEqual(challengeStreak.currentStreak.numberOfDaysInARow + 1);
        expect(longestCurrentStreak.startDate).toBeDefined();
        expect(longestCurrentStreak.streakType).toEqual(StreakTypes.challenge);
    });

    test(`if users longest current streak is a team member streak set the users longestCurrentStreak to the team member streak.`, async () => {
        expect.assertions(6);

        const user = await getPayingUser({ testName });

        const streakName = 'Daily Spanish';

        await SDK.soloStreaks.create({
            userId: user._id,
            streakName,
        });

        const creatorId = user._id;
        const members = [{ memberId: creatorId }];

        const teamStreak = await SDK.teamStreaks.create({
            creatorId,
            streakName,
            members,
        });

        const teamMemberStreak = await SDK.teamMemberStreaks.create({
            userId: user._id,
            teamStreakId: teamStreak._id,
        });

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        const { challenge } = await SDK.challenges.create({
            name,
            description,
            icon,
        });

        await SDK.challengeStreaks.create({
            userId: user._id,
            challengeId: challenge._id,
        });

        await SDK.completeTeamMemberStreakTasks.create({
            userId: user._id,
            teamMemberStreakId: teamMemberStreak._id,
            teamStreakId: teamStreak._id,
        });

        await UserStreakHelper.updateUsersLongestCurrentStreak({ userId: user._id });

        const updatedUser = await SDK.user.getCurrentUser();

        const longestCurrentStreak = updatedUser.longestCurrentStreak as LongestCurrentTeamMemberStreak;

        expect(longestCurrentStreak.teamMemberStreakId).toEqual(String(teamMemberStreak._id));
        expect(longestCurrentStreak.teamStreakId).toEqual(teamStreak._id);
        expect(longestCurrentStreak.teamStreakName).toEqual(teamStreak.streakName);
        expect(longestCurrentStreak.numberOfDays).toEqual(teamStreak.currentStreak.numberOfDaysInARow + 1);
        expect(longestCurrentStreak.startDate).toBeDefined();
        expect(longestCurrentStreak.streakType).toEqual(StreakTypes.teamMember);
    });

    test(`if user has no active streaks it remains an object with just number of days.`, async () => {
        expect.assertions(1);

        const user = await getPayingUser({ testName });

        const streakName = 'Daily Spanish';

        await SDK.soloStreaks.create({
            userId: user._id,
            streakName,
        });

        const creatorId = user._id;
        const members = [{ memberId: creatorId }];

        const teamStreak = await SDK.teamStreaks.create({
            creatorId,
            streakName,
            members,
        });

        await SDK.teamMemberStreaks.create({
            userId: user._id,
            teamStreakId: teamStreak._id,
        });

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        const { challenge } = await SDK.challenges.create({
            name,
            description,
            icon,
        });

        await SDK.challengeStreaks.create({
            userId: user._id,
            challengeId: challenge._id,
        });

        await UserStreakHelper.updateUsersLongestCurrentStreak({ userId: user._id });

        const updatedUser = await SDK.user.getCurrentUser();

        const longestCurrentStreak = updatedUser.longestCurrentStreak;

        expect(longestCurrentStreak).toEqual({ numberOfDays: 0, streakType: StreakTypes.unknown });
    });
});
