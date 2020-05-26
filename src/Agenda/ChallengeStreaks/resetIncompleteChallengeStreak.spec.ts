/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('../../helpers/createActivityFeedItem', () => ({
    __esModule: true,
    createActivityFeedItem: jest.fn().mockResolvedValue(true),
}));
jest.mock('../../helpers/createStreakTrackingEvent', () => ({
    __esModule: true,
    createStreakTrackingEvent: jest.fn().mockResolvedValue(true),
}));

import { resetIncompleteChallengeStreaks } from './resetIncompleteChallengeStreaks';
import { challengeStreakModel } from '../../../src/Models/ChallengeStreak';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { createActivityFeedItem } from '../../helpers/createActivityFeedItem';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';
import { userModel } from '../../Models/User';
import { getMockUser } from '../../testHelpers/getMockUser';
import { challengeModel } from '../../Models/Challenge';

describe('resetIncompleteChallengeStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('that incomplete challenge streaks default current streak is reset and old streak is pushed to past streaks and lost streak activity is recorded', async () => {
        expect.assertions(5);
        challengeStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(true) as any;
        userModel.findById = jest.fn().mockResolvedValue(getMockUser()) as any;
        const challengeId = 'challengeId';
        const challengeName = 'reading';
        challengeModel.findById = jest.fn().mockResolvedValue({ _id: challengeId, name: challengeName }) as any;
        const _id = '1234';
        const endDate = new Date().toString();
        const currentStreak = {
            startDate: undefined,
            numberOfDaysInARow: 0,
        };
        const userId = getMockUser()._id;
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
                challengeId,
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

        expect(userModel.findById).toBeCalledWith(userId);

        expect(challengeModel.findById).toBeCalledWith(challengeId);

        expect(createActivityFeedItem).toBeCalledWith({
            activityFeedItemType: ActivityFeedItemTypes.lostChallengeStreak,
            userId,
            username: getMockUser().username,
            userProfileImage: getMockUser().profileImages.originalImageUrl,
            challengeStreakId: _id,
            challengeId,
            challengeName,
            numberOfDaysLost: currentStreak.numberOfDaysInARow,
        });

        expect(createStreakTrackingEvent).toBeCalledWith({
            type: StreakTrackingEventTypes.lostStreak,
            streakId: _id,
            userId,
            streakType: StreakTypes.challenge,
        });
    });
});
