import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { LostSoloStreakActivityFeedItem } from '@streakoid/streakoid-models/lib/Models/ActivityFeedItemType';
import { activityFeedItems as activityFeedItemsImport } from './activityFeedItems';
import SupportedResponseHeaders from '@streakoid/streakoid-models/lib/Types/SupportedResponseHeaders';
describe('SDK activityFeedItems', () => {
    const getRequest = jest
        .fn()
        .mockResolvedValue({ body: true, header: { [SupportedResponseHeaders.TotalCount]: 10 } });
    const postRequest = jest.fn().mockResolvedValue(true);
    const activityFeedItems = activityFeedItemsImport({
        getRequest,
        postRequest,
    });

    describe('getAll', () => {
        const userIds = ['userId', 'followerId'];
        const soloStreakId = 'subjectId';
        const challengeStreakId = 'challengeStreakId';
        const challengeId = 'challengeId';
        const teamStreakId = 'teamStreakId';
        const activityFeedItemType = ActivityFeedItemTypes.createdSoloStreak;
        const limit = 10;
        const createdAtBefore = new Date();

        const query = {
            userIds,
            soloStreakId,
            challengeStreakId,
            challengeId,
            teamStreakId,
            activityFeedItemType,
            limit,
            createdAtBefore,
        };

        test('calls GET with correct URL when no query parameters are passed', async () => {
            expect.assertions(1);

            await activityFeedItems.getAll({ limit });

            expect(getRequest).toBeCalledWith({ route: `/v1/activity-feed-items?limit=${limit}&` });
        });

        test('calls GET with correct URL when all query parameters are passed', async () => {
            expect.assertions(1);

            await activityFeedItems.getAll(query);

            expect(getRequest).toBeCalledWith({
                route: `/v1/activity-feed-items?limit=${limit}&createdAtBefore=${createdAtBefore.toISOString()}&userIds=${encodeURIComponent(
                    JSON.stringify(userIds),
                )}&soloStreakId=${soloStreakId}&challengeStreakId=${challengeStreakId}&challengeId=${challengeId}&teamStreakId=${teamStreakId}&activityFeedItemType=${activityFeedItemType}&`,
            });
        });
    });
    describe('create', () => {
        test('calls POST with an ActivityFeedItemType', async () => {
            expect.assertions(1);

            const activityFeedItem: LostSoloStreakActivityFeedItem = {
                activityFeedItemType: ActivityFeedItemTypes.lostSoloStreak,
                userId: 'userId',
                username: 'username',
                userProfileImage: 'google.com/image',
                soloStreakId: 'soloStreakId',
                soloStreakName: 'Reading',
                numberOfDaysLost: 1,
            };

            await activityFeedItems.create(activityFeedItem);

            expect(postRequest).toBeCalledWith({ route: `/v1/activity-feed-items`, params: activityFeedItem });
        });
    });
});
