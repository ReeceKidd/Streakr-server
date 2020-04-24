import { resetIncompleteChallengeStreaks } from '../../../src/Agenda/ChallengeStreaks/resetIncompleteChallengeStreaks';

import { isTestEnvironment } from '../../../tests/setup/isTestEnvironment';
import { setupDatabase } from '../../setup/setupDatabase';
import { getPayingUser } from '../../setup/getPayingUser';
import { streakoidTest } from '../../../tests/setup/streakoidTest';
import { tearDownDatabase } from '../../setup/tearDownDatabase';
import { StreakoidFactory } from '@streakoid/streakoid-sdk/lib/streakoid';
import {
    Challenge,
    StreakStatus,
    StreakTrackingEventTypes,
    StreakTypes,
    ActivityFeedItemTypes,
} from '@streakoid/streakoid-models/lib';

jest.setTimeout(120000);

describe('resetIncompleteChallengeStreaks', () => {
    let streakoid: StreakoidFactory;
    let userId: string;
    let username: string;
    let userProfileImage: string;
    let challengeStreakId: string;
    let challenge: Challenge;
    const name = 'Duolingo';
    const description = 'Everyday I must complete a duolingo lesson';
    const icon = 'duolingo';

    beforeAll(async () => {
        if (isTestEnvironment()) {
            await setupDatabase();
            const user = await getPayingUser();
            userId = user._id;
            username = user.username;
            (userProfileImage = user.profileImages.originalImageUrl), (streakoid = await streakoidTest());
            const challengeResponse = await streakoid.challenges.create({
                name,
                description,
                icon,
            });
            challenge = challengeResponse.challenge;
            const challengeStreak = await streakoid.challengeStreaks.create({
                userId,
                challengeId: challenge._id,
            });
            challengeStreakId = challengeStreak._id;
        }
    });

    afterAll(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase();
        }
    });

    test('adds current streak to past streak,  resets the current streak and creates a lost streak tracking event.', async () => {
        expect.assertions(34);

        const incompleteChallengeStreaks = await streakoid.challengeStreaks.getAll({
            completedToday: false,
        });

        const endDate = new Date();
        await resetIncompleteChallengeStreaks(incompleteChallengeStreaks, endDate.toString());

        const updatedChallengeStreak = await streakoid.challengeStreaks.getOne({ challengeStreakId });

        expect(updatedChallengeStreak.status).toEqual(StreakStatus.live);
        expect(updatedChallengeStreak.userId).toEqual(expect.any(String));
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
                'challengeId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const streakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
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

        const lostChallengeStreakItems = await streakoid.activityFeedItems.getAll({
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
