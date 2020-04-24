/* eslint-disable @typescript-eslint/no-explicit-any */
import { trackInactiveChallengeStreaks } from './trackInactiveChallengeStreaks';
import streakoid from '../../streakoid';

import { StreakTrackingEventTypes, StreakTypes } from '@streakoid/streakoid-models/lib';

describe('trackInactiveChallengeStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('that inactive challenge streak activity gets updated and a challenge streak tracking event is created', async () => {
        expect.assertions(1);
        streakoid.challengeStreaks.update = jest.fn().mockResolvedValue({ data: {} });
        streakoid.streakTrackingEvents.create = jest.fn().mockResolvedValue(true);
        const _id = '1';
        const currentStreak = {
            startDate: '24/02/95',
            numberOfDaysInARow: 1,
        };
        const userId = 'userId';
        const inactiveChallengeStreak = {
            _id,
            currentStreak,
            startDate: new Date(),
            completedToday: true,
            active: false,
            activity: [],
            pastStreaks: [],
            streakName: 'Daily Danish',
            streakDescription: 'Each day I must do Danish',
            userId,
            timezone: 'Europe/London',
            createdAt: new Date(),
            updatedAt: new Date(),
        } as any;
        const inactiveChallengeStreaks = [inactiveChallengeStreak];
        await trackInactiveChallengeStreaks(inactiveChallengeStreaks as any);

        expect(streakoid.streakTrackingEvents.create).toBeCalledWith({
            type: StreakTrackingEventTypes.inactiveStreak,
            streakId: _id,
            userId,
            streakType: StreakTypes.challenge,
        });
    });
});
