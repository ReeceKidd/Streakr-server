/* eslint-disable @typescript-eslint/no-explicit-any */
import { resetIncompleteChallengeStreaks } from './resetIncompleteChallengeStreaks';
import streakoid from '../../streakoid';
import { StreakTrackingEventTypes, StreakTypes, ActivityFeedItemTypes } from '@streakoid/streakoid-models/lib';
import { challengeStreakModel } from '../../../src/Models/ChallengeStreak';

describe('resetIncompleteChallengeStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('that incomplete challenge streaks default current streak is reset and old streak is pushed to past streaks and lost streak activity is recorded', async () => {
        expect.assertions(3);
        challengeStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(true) as any;
        streakoid.streakTrackingEvents.create = jest.fn().mockResolvedValue(true);
        streakoid.activityFeedItems.create = jest.fn().mockResolvedValue(true);
        const username = 'username';
        const challengeName = 'reading';
        const userProfileImage = 'google.com/image';
        streakoid.users.getOne = jest
            .fn()
            .mockResolvedValue({ username, profileImages: { originalImageUrl: userProfileImage } });
        streakoid.challenges.getOne = jest.fn().mockResolvedValue({ _id: '_id', name: challengeName });
        const _id = '1234';
        const endDate = new Date().toString();
        const currentStreak = {
            startDate: undefined,
            numberOfDaysInARow: 0,
        };
        const userId = '5c35116059f7ba19e4e248a9';
        const incompleteChallengeStreaks = [
            {
                _id,
                currentStreak,
                startDate: new Date().toString(),
                completedToday: false,
                pastStreaks: [],
                streakName: 'Daily Danish',
                streakDescription: 'Each day I must do Danish',
                userId,
                timezone: 'Europe/London',
                createdAt: new Date().toString(),
                updatedAt: new Date().toString(),
            } as any,
        ];
        const pastStreaks = [{ numberOfDaysInARow: 0, endDate, startDate: endDate }];
        await resetIncompleteChallengeStreaks(incompleteChallengeStreaks as any, endDate);

        expect(challengeStreakModel.findByIdAndUpdate).toBeCalledWith(_id, {
            $set: {
                currentStreak: { startDate: '', numberOfDaysInARow: 0 },
                pastStreaks,
                active: false,
            },
        });

        expect(streakoid.activityFeedItems.create).toBeCalledWith({
            activityFeedItemType: ActivityFeedItemTypes.lostChallengeStreak,
            userId: userId,
            username,
            userProfileImage,
            challengeStreakId: _id,
            challengeId: '_id',
            challengeName,
            numberOfDaysLost: currentStreak.numberOfDaysInARow,
        });

        expect(streakoid.streakTrackingEvents.create).toBeCalledWith({
            type: StreakTrackingEventTypes.lostStreak,
            streakId: _id,
            userId,
            streakType: StreakTypes.challenge,
        });
    });
});
