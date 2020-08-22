import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { Mongoose } from 'mongoose';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { correctSoloStreakKeys } from '../src/testHelpers/correctSoloStreakKeys';
import IndividualVisibilityTypes from '@streakoid/streakoid-models/lib/Types/IndividualVisibilityTypes';

jest.setTimeout(120000);

const testName = 'POST-solo-streaks';

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

    test(`creates solo streak with all available parameters`, async () => {
        expect.assertions(14);

        const streakName = 'Daily Spanish';
        const streakDescription = 'I must do 30 minutes of Spanish everyday';
        const numberOfMinutes = 30;
        const visibility = IndividualVisibilityTypes.onlyMe;

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const soloStreak = await SDK.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
            numberOfMinutes,
            visibility,
        });

        const { status, _id, currentStreak, completedToday, active, pastStreaks, createdAt, updatedAt } = soloStreak;

        expect(soloStreak.streakName).toEqual(streakName);
        expect(status).toEqual(StreakStatus.live);
        expect(soloStreak.streakDescription).toEqual(streakDescription);
        expect(soloStreak.numberOfMinutes).toEqual(numberOfMinutes);
        expect(soloStreak.userId).toBeDefined();
        expect(_id).toBeDefined();
        expect(Object.keys(currentStreak)).toEqual(['numberOfDaysInARow']);
        expect(currentStreak.numberOfDaysInARow).toEqual(0);
        expect(completedToday).toEqual(false);
        expect(active).toEqual(false);
        expect(pastStreaks).toEqual([]);
        expect(createdAt).toBeDefined();
        expect(updatedAt).toBeDefined();
        expect(Object.keys(soloStreak).sort()).toEqual([...correctSoloStreakKeys, 'numberOfMinutes'].sort());
    });

    test(`creates solo streak with minimum number of parameters`, async () => {
        expect.assertions(14);

        const streakName = 'Daily Spanish';

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const soloStreak = await SDK.soloStreaks.create({
            userId,
            streakName,
        });

        const {
            status,
            streakDescription,
            numberOfMinutes,
            _id,
            currentStreak,
            completedToday,
            active,
            pastStreaks,
            createdAt,
            updatedAt,
        } = soloStreak;

        expect(soloStreak.streakName).toEqual(streakName);
        expect(status).toEqual(StreakStatus.live);
        expect(numberOfMinutes).toEqual(undefined);
        expect(streakDescription).toEqual('');
        expect(soloStreak.userId).toBeDefined();
        expect(_id).toBeDefined();
        expect(Object.keys(currentStreak)).toEqual(['numberOfDaysInARow']);
        expect(currentStreak.numberOfDaysInARow).toEqual(0);
        expect(completedToday).toEqual(false);
        expect(active).toEqual(false);
        expect(pastStreaks).toEqual([]);
        expect(createdAt).toBeDefined();
        expect(updatedAt).toBeDefined();
        expect(Object.keys(soloStreak).sort()).toEqual(correctSoloStreakKeys);
    });

    test(`when a soloStreak is created the users live streak count is increased by one.`, async () => {
        expect.assertions(1);

        const streakName = 'Daily Spanish';
        const user = await getPayingUser({ testName });
        const userId = user._id;

        await SDK.soloStreaks.create({
            userId,
            streakName,
        });

        const updatedUser = await SDK.users.getOne(userId);

        expect(updatedUser.totalLiveStreaks).toEqual(1);
    });

    test(`when a soloStreak is created an CreatedSoloStreakActivityFeedItem is created`, async () => {
        expect.assertions(6);

        const streakName = 'Daily Spanish';

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const username = user.username;
        const userProfileImage = user.profileImages.originalImageUrl;

        const soloStreak = await SDK.soloStreaks.create({
            userId,
            streakName,
        });

        const { activityFeedItems } = await SDK.activityFeedItems.getAll({
            soloStreakId: soloStreak._id,
            activityFeedItemType: ActivityFeedItemTypes.createdSoloStreak,
        });
        const activityFeedItem = activityFeedItems.find(
            item => item.activityFeedItemType === ActivityFeedItemTypes.createdSoloStreak,
        );
        if (activityFeedItem && activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.createdSoloStreak) {
            expect(activityFeedItem.soloStreakId).toEqual(String(soloStreak._id));
            expect(activityFeedItem.soloStreakName).toEqual(String(soloStreak.streakName));
            expect(activityFeedItem.userId).toEqual(String(soloStreak.userId));
            expect(activityFeedItem.username).toEqual(username);
            expect(activityFeedItem.userProfileImage).toEqual(String(userProfileImage));
            expect(Object.keys(activityFeedItem).sort()).toEqual(
                [
                    '_id',
                    'activityFeedItemType',
                    'userId',
                    'username',
                    'userProfileImage',
                    'soloStreakId',
                    'soloStreakName',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );
        }
    });
});
