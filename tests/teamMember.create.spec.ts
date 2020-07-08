import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { getFriend } from './setup/getFriend';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { getServiceConfig } from '../src/getServiceConfig';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { correctTeamMemberStreakKeys } from '../src/testHelpers/correctTeamMemberStreakKeys';
import { correctPopulatedTeamStreakKeys } from '../src/testHelpers/correctPopulatedTeamStreakKeys';

jest.setTimeout(120000);

const testName = 'POST-team-members';

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

    test(`adds new team member to team streak`, async () => {
        expect.assertions(45);

        const originalImageUrl = getServiceConfig().DEFAULT_USER_PROFILE_IMAGE_URL;
        const user = await getPayingUser({ testName });
        const userId = user._id;
        const friend = await getFriend({ testName });
        const friendId = friend._id;
        const streakName = 'Daily Spanish';

        const members = [{ memberId: userId }];

        const originalTeamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        const teamMember = await SDK.teamStreaks.teamMembers.create({
            userId: friendId,
            teamStreakId: originalTeamStreak._id,
        });

        expect(teamMember.memberId).toBeDefined();
        expect(teamMember.teamMemberStreakId).toEqual(expect.any(String));
        expect(Object.keys(teamMember).sort()).toEqual(['memberId', 'teamMemberStreakId'].sort());

        const teamStreak = await SDK.teamStreaks.getOne(originalTeamStreak._id);

        expect(teamStreak.streakName).toEqual(expect.any(String));
        expect(teamStreak.status).toEqual(StreakStatus.live);
        expect(teamStreak.creatorId).toBeDefined();
        expect(teamStreak.timezone).toEqual(expect.any(String));
        expect(teamStreak.active).toEqual(false);
        expect(teamStreak.completedToday).toEqual(false);
        expect(teamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(teamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(teamStreak.pastStreaks.length).toEqual(0);
        expect(Object.keys(teamStreak).sort()).toEqual(correctPopulatedTeamStreakKeys);

        const { creator } = teamStreak;
        expect(creator._id).toBeDefined();
        expect(creator.username).toBeDefined();
        expect(Object.keys(creator).sort()).toEqual(['_id', 'username'].sort());

        expect(teamStreak.members.length).toEqual(2);

        const member = teamStreak.members[0];
        expect(member._id).toBeDefined();
        expect(member.username).toBeDefined();
        expect(member.profileImage).toEqual(originalImageUrl);
        expect(Object.keys(member).sort()).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak'].sort());

        expect(member.teamMemberStreak._id).toEqual(expect.any(String));
        expect(member.teamMemberStreak.completedToday).toEqual(false);
        expect(member.teamMemberStreak.active).toEqual(false);
        expect(member.teamMemberStreak.pastStreaks).toEqual([]);
        expect(member.teamMemberStreak.userId).toBeDefined();
        expect(member.teamMemberStreak.teamStreakId).toEqual(teamStreak._id);
        expect(member.teamMemberStreak.timezone).toBeDefined();
        expect(member.teamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(member.teamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(member.teamMemberStreak).sort()).toEqual(correctTeamMemberStreakKeys);

        const friendMember = teamStreak.members[1];
        expect(friendMember._id).toBeDefined();
        expect(friendMember.username).toEqual(expect.any(String));
        expect(friendMember.profileImage).toEqual(originalImageUrl);
        expect(Object.keys(friendMember).sort()).toEqual(
            ['_id', 'username', 'profileImage', 'teamMemberStreak'].sort(),
        );

        expect(friendMember.teamMemberStreak._id).toEqual(expect.any(String));
        expect(friendMember.teamMemberStreak.completedToday).toEqual(false);
        expect(friendMember.teamMemberStreak.active).toEqual(false);
        expect(friendMember.teamMemberStreak.pastStreaks).toEqual([]);
        expect(friendMember.teamMemberStreak.userId).toBeDefined();
        expect(friendMember.teamMemberStreak.teamStreakId).toEqual(teamStreak._id);
        expect(friendMember.teamMemberStreak.timezone).toBeDefined();
        expect(friendMember.teamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(friendMember.teamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(friendMember.teamMemberStreak).sort()).toEqual(correctTeamMemberStreakKeys);
    });

    test(`when a friend joins a team streak it creates a JoinedTeamStreakActivityFeedItem`, async () => {
        expect.assertions(6);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const userProfileImage = user.profileImages.originalImageUrl;
        const friend = await getFriend({ testName });
        const friendId = friend._id;
        const streakName = 'Daily Spanish';

        const members = [{ memberId: userId }];

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        await SDK.teamStreaks.teamMembers.create({
            userId: friendId,
            teamStreakId: teamStreak._id,
        });

        const { activityFeedItems } = await SDK.activityFeedItems.getAll({
            teamStreakId: teamStreak._id,
        });
        const activityFeedItem = activityFeedItems.find(
            item => item.activityFeedItemType === ActivityFeedItemTypes.joinedTeamStreak,
        );
        if (activityFeedItem && activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.joinedTeamStreak) {
            expect(activityFeedItem.teamStreakId).toEqual(String(teamStreak._id));
            expect(activityFeedItem.teamStreakName).toEqual(String(teamStreak.streakName));
            expect(activityFeedItem.userId).toEqual(String(userId));
            expect(activityFeedItem.username).toBeDefined();
            expect(activityFeedItem.userProfileImage).toEqual(userProfileImage);
            expect(Object.keys(activityFeedItem).sort()).toEqual(
                [
                    '_id',
                    'activityFeedItemType',
                    'userId',
                    'username',
                    'userProfileImage',
                    'teamStreakId',
                    'teamStreakName',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );
        }
    });

    test(`friend can not join a team streak they are already apart off`, async () => {
        expect.assertions(2);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const friend = await getFriend({ testName });
        const friendId = friend._id;
        const streakName = 'Daily Spanish';

        const members = [{ memberId: userId }];

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        await SDK.teamStreaks.teamMembers.create({
            userId: friendId,
            teamStreakId: teamStreak._id,
        });

        try {
            await SDK.teamStreaks.teamMembers.create({
                userId,
                teamStreakId: teamStreak._id,
            });
        } catch (err) {
            const error = JSON.parse(err.text);
            const { message } = error;
            expect(err.status).toEqual(400);
            expect(message).toEqual(`Team member is already in team streak.`);
        }
    });
});
