import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '../src/SDK/streakoidSDKFactory';
import { streakoidTestSDKFactory } from '../src/SDK/streakoidTestSDKFactory';
import { disconnectDatabase } from './setup/disconnectDatabase';

jest.setTimeout(120000);

const testName = 'POST-activity-feed-items';

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

    test(`activity feed item event can be created`, async () => {
        expect.assertions(2);
        const user = await getPayingUser({ testName });
        const streakName = 'Daily Spanish';
        const streakDescription = 'Everyday I must do 30 minutes of Spanish';
        const soloStreak = await SDK.soloStreaks.create({
            userId: user._id,
            streakName,
            streakDescription,
        });
        const activityFeedItem = await SDK.activityFeedItems.create({
            activityFeedItemType: ActivityFeedItemTypes.lostSoloStreak,
            soloStreakId: soloStreak._id,
            soloStreakName: soloStreak.streakName,
            userId: user._id,
            userProfileImage: user.profileImages.originalImageUrl,
            username: user.username,
            numberOfDaysLost: 10,
        });

        expect(activityFeedItem.activityFeedItemType).toEqual(ActivityFeedItemTypes.lostSoloStreak);
        expect(Object.keys(activityFeedItem).sort()).toEqual(
            [
                '_id',
                'activityFeedItemType',
                'soloStreakId',
                'soloStreakName',
                'userId',
                'username',
                'userProfileImage',
                'numberOfDaysLost',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });
});
