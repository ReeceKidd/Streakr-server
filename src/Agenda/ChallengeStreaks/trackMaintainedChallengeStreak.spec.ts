/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('../../helpers/createStreakTrackingEvent', () => ({
    __esModule: true,
    createStreakTrackingEvent: jest.fn().mockResolvedValue(true),
}));

import { trackMaintainedChallengeStreaks } from './trackMaintainedChallengeStreaks';
import { challengeStreakModel } from '../../../src/Models/ChallengeStreak';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';
import { getMockUser } from '../../testHelpers/getMockUser';
import { getMockChallenge } from '../../testHelpers/getMockChallenge';
import { getMockChallengeStreak } from '../../testHelpers/getMockChallengeStreak';
import { userModel } from '../../Models/User';

describe('trackMaintainedChallengeStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('sets completed today to false when challenge streak is maintained.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: 'userId' });
        challengeStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        userModel.findById = jest.fn().mockResolvedValue(user) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;

        const currentStreak = {
            startDate: '24/02/95',
            numberOfDaysInARow: 1,
        };

        const challenge = getMockChallenge();
        const challengeStreak = getMockChallengeStreak({ user, challenge });
        const maintainedChallengeStreaks = [{ ...challengeStreak, currentStreak }];
        await trackMaintainedChallengeStreaks(maintainedChallengeStreaks as any);
        await trackMaintainedChallengeStreaks(maintainedChallengeStreaks as any);

        expect(challengeStreakModel.findByIdAndUpdate).toBeCalledWith(challengeStreak._id, {
            $set: { completedToday: false },
        });
    });

    test('if challenge streak current streak is longer than the users longest ever streak it updates the users longest ever streak.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: 'userId' });
        challengeStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        userModel.findById = jest.fn().mockResolvedValue(user) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;

        const currentStreak = {
            startDate: '24/02/95',
            numberOfDaysInARow: 100,
        };

        const challenge = getMockChallenge();
        const challengeStreak = getMockChallengeStreak({ user, challenge });
        const maintainedChallengeStreaks = [{ ...challengeStreak, currentStreak }];
        await trackMaintainedChallengeStreaks(maintainedChallengeStreaks as any);

        expect(userModel.findByIdAndUpdate).toBeCalledWith(user._id, {
            $set: {
                longestEverStreak: {
                    challengeStreakId: challengeStreak._id,
                    challengeId: challengeStreak.challengeId,
                    challengeName: challengeStreak.challengeName,
                    numberOfDays: currentStreak.numberOfDaysInARow,
                    startDate: currentStreak.startDate,
                },
            },
        });
    });

    test('if challenge streak current streak is longer than the users longest current streak it updates the users longest current streak.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: 'userId' });
        challengeStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        userModel.findById = jest.fn().mockResolvedValue(user) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;

        const currentStreak = {
            startDate: '24/02/95',
            numberOfDaysInARow: 100,
        };

        const challenge = getMockChallenge();
        const challengeStreak = getMockChallengeStreak({ user, challenge });
        const maintainedChallengeStreaks = [{ ...challengeStreak, currentStreak }];
        await trackMaintainedChallengeStreaks(maintainedChallengeStreaks as any);

        expect(userModel.findByIdAndUpdate).toBeCalledWith(user._id, {
            $set: {
                longestCurrentStreak: {
                    challengeStreakId: challengeStreak._id,
                    challengeId: challengeStreak.challengeId,
                    challengeName: challengeStreak.challengeName,
                    numberOfDays: currentStreak.numberOfDaysInARow,
                    startDate: currentStreak.startDate,
                },
            },
        });
    });

    test('creates a streak tracking event when streak is maintained.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: 'userId' });
        challengeStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        userModel.findById = jest.fn().mockResolvedValue(user) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;

        const currentStreak = {
            startDate: '24/02/95',
            numberOfDaysInARow: 1,
        };
        const challenge = getMockChallenge();
        const challengeStreak = getMockChallengeStreak({ user, challenge });
        const maintainedChallengeStreaks = [{ ...challengeStreak, currentStreak }];
        await trackMaintainedChallengeStreaks(maintainedChallengeStreaks as any);

        expect(createStreakTrackingEvent).toBeCalledWith({
            type: StreakTrackingEventTypes.maintainedStreak,
            streakId: challengeStreak._id,
            userId: user._id,
            streakType: StreakTypes.challenge,
        });
    });
});
