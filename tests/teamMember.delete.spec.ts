import { StreakoidFactory, londonTimezone } from '../src/streakoid';
import { streakoidTest } from './setup/streakoidTest';
import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setUpDatabase } from './setup/setUpDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { getFriend } from './setup/getFriend';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { getServiceConfig } from '../getServiceConfig';

const username = getServiceConfig().USER;
const originalImageUrl = getServiceConfig().ORIGINAL_IMAGE_URL;

jest.setTimeout(120000);

describe('DELETE /team-members', () => {
    let streakoid: StreakoidFactory;
    let userId: string;
    let followerId: string;
    const streakName = 'Daily Spanish';

    beforeAll(async () => {
        if (isTestEnvironment()) {
            await setUpDatabase();
            const user = await getPayingUser();
            userId = user._id;
            streakoid = await streakoidTest();
            const follower = await getFriend();
            followerId = follower._id;
        }
    });

    afterAll(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase();
        }
    });

    test(`deletes member from team streak`, async () => {
        expect.assertions(29);

        const members = [{ memberId: userId }];

        const originalTeamStreak = await streakoid.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        await streakoid.teamStreaks.teamMembers.create({
            followerId,
            teamStreakId: originalTeamStreak._id,
        });

        const { status } = await streakoid.teamStreaks.teamMembers.deleteOne({
            teamStreakId: originalTeamStreak._id,
            memberId: followerId,
        });

        expect(status).toEqual(204);

        const teamStreak = await streakoid.teamStreaks.getOne(originalTeamStreak._id);

        expect(teamStreak.streakName).toEqual(expect.any(String));
        expect(teamStreak.status).toEqual(StreakStatus.live);
        expect(teamStreak.creatorId).toBeDefined();
        expect(teamStreak.timezone).toEqual(expect.any(String));
        expect(teamStreak.active).toEqual(false);
        expect(teamStreak.completedToday).toEqual(false);
        expect(teamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(teamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(teamStreak.pastStreaks.length).toEqual(0);
        expect(Object.keys(teamStreak).sort()).toEqual(
            [
                '_id',
                'members',
                'status',
                'creatorId',
                'creator',
                'streakName',
                'timezone',
                'active',
                'completedToday',
                'currentStreak',
                'pastStreaks',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const { creator } = teamStreak;
        expect(creator._id).toBeDefined();
        expect(creator.username).toEqual(username);
        expect(Object.keys(creator).sort()).toEqual(['_id', 'username'].sort());

        expect(teamStreak.members.length).toEqual(1);

        const member = teamStreak.members[0];
        expect(member._id).toBeDefined();
        expect(member.username).toEqual(username);
        expect(member.profileImage).toEqual(originalImageUrl);
        expect(Object.keys(member)).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak']);

        expect(member.teamMemberStreak._id).toEqual(expect.any(String));
        expect(member.teamMemberStreak.completedToday).toEqual(false);
        expect(member.teamMemberStreak.active).toEqual(false);
        expect(member.teamMemberStreak.pastStreaks).toEqual([]);
        expect(member.teamMemberStreak.userId).toBeDefined();
        expect(member.teamMemberStreak.teamStreakId).toEqual(originalTeamStreak._id);
        expect(member.teamMemberStreak.timezone).toEqual(londonTimezone);
        expect(member.teamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(member.teamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(member.teamMemberStreak)).toEqual([
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
        ]);
    });
});
