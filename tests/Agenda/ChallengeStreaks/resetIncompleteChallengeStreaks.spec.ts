import { resetIncompleteChallengeStreaks } from '../../../src/Agenda/ChallengeStreaks/resetIncompleteChallengeStreaks';

import { isTestEnvironment } from '../../../tests/setup/isTestEnvironment';
import { setupDatabase } from '../../setup/setupDatabase';
import { getPayingUser } from '../../setup/getPayingUser';
import { tearDownDatabase } from '../../setup/tearDownDatabase';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { Mongoose } from 'mongoose';
import { disconnectDatabase } from '../../setup/disconnectDatabase';
import { StreakoidSDK } from '../../../src/SDK/streakoidSDKFactory';
import { streakoidTestSDKFactory } from '../../../src/SDK/streakoidTestSDKFactory';

jest.setTimeout(120000);

const testName = 'resetIncompleteChallengeStreaks';

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

    test('adds current streak to past streak, resets the current streak and creates a lost streak tracking event.', async () => {
        expect.assertions(38);

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const username = user.username;
        const userProfileImage = user.profileImages.originalImageUrl;

        const { challenge } = await SDK.challenges.create({
            name,
            description,
            icon,
        });
        const challengeStreak = await SDK.challengeStreaks.create({
            userId,
            challengeId: challenge._id,
        });
        const challengeStreakId = challengeStreak._id;

        const incompleteChallengeStreaks = await SDK.challengeStreaks.getAll({
            completedToday: false,
        });

        const endDate = new Date();
        await resetIncompleteChallengeStreaks(incompleteChallengeStreaks, endDate.toString());

        const updatedChallengeStreak = await SDK.challengeStreaks.getOne({ challengeStreakId });

        expect(updatedChallengeStreak.status).toEqual(StreakStatus.live);
        expect(updatedChallengeStreak.userId).toEqual(expect.any(String));
        expect(updatedChallengeStreak.username).toEqual(user.username);
        expect(updatedChallengeStreak.userProfileImage).toEqual(user.profileImages.originalImageUrl);
        expect(updatedChallengeStreak.challengeId).toEqual(challenge._id);
        expect(updatedChallengeStreak.challengeName).toEqual(challenge.name);
        expect(updatedChallengeStreak.completedToday).toEqual(false);
        expect(updatedChallengeStreak.active).toEqual(false);
        expect(updatedChallengeStreak.pastStreaks.length).toEqual(1);
        const pastStreak = updatedChallengeStreak.pastStreaks[0];
        expect(pastStreak.endDate).toEqual(expect.any(String));
        expect(pastStreak.numberOfDaysInARow).toEqual(0);
        expect(pastStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(pastStreak).sort()).toEqual(['endDate', 'numberOfDaysInARow', 'startDate'].sort());
        expect(updatedChallengeStreak.timezone).toEqual(expect.any(String));
        const currentStreak = updatedChallengeStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(0);
        expect(currentStreak.startDate).toEqual(null);
        expect(Object.keys(currentStreak)).toEqual(['startDate', 'numberOfDaysInARow']);
        expect(updatedChallengeStreak._id).toEqual(expect.any(String));
        expect(updatedChallengeStreak.createdAt).toEqual(expect.any(String));
        expect(updatedChallengeStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedChallengeStreak).sort()).toEqual(
            [
                '_id',
                'status',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'username',
                'userProfileImage',
                'challengeId',
                'challengeName',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const streakTrackingEvents = await SDK.streakTrackingEvents.getAll({
            userId,
        });
        const streakTrackingEvent = streakTrackingEvents[0];

        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.lostStreak);
        expect(streakTrackingEvent.userId).toBeDefined();
        expect(streakTrackingEvent.streakId).toBeDefined();
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.challenge);
        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        const lostChallengeStreakItems = await SDK.activityFeedItems.getAll({
            activityFeedItemType: ActivityFeedItemTypes.lostChallengeStreak,
        });
        const lostChallengeStreakItem = lostChallengeStreakItems.activityFeedItems[0];
        if (lostChallengeStreakItem.activityFeedItemType === ActivityFeedItemTypes.lostChallengeStreak) {
            expect(lostChallengeStreakItem.activityFeedItemType).toEqual(ActivityFeedItemTypes.lostChallengeStreak);
            expect(lostChallengeStreakItem.userId).toEqual(String(userId));
            expect(lostChallengeStreakItem.username).toEqual(String(username));
            expect(lostChallengeStreakItem.userProfileImage).toEqual(String(userProfileImage));
            expect(lostChallengeStreakItem.challengeStreakId).toEqual(String(challengeStreakId));
            expect(lostChallengeStreakItem.challengeId).toEqual(String(challenge._id));
            expect(lostChallengeStreakItem.challengeName).toEqual(String(challenge.name));
            expect(lostChallengeStreakItem.numberOfDaysLost).toEqual(expect.any(Number));
            expect(Object.keys(lostChallengeStreakItem).sort()).toEqual(
                [
                    '_id',
                    'activityFeedItemType',
                    'challengeStreakId',
                    'challengeId',
                    'challengeName',
                    'userId',
                    'username',
                    'userProfileImage',
                    'numberOfDaysLost',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );
        }
    });
});
