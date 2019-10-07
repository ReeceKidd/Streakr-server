/* eslint-disable @typescript-eslint/no-explicit-any */
import { trackInactiveSoloStreaks } from './trackInactiveSoloStreaks';
import streakoid from '../../streakoid';
import StreakTrackingEventType from '@streakoid/streakoid-sdk/lib/streakTrackingEventType';

describe('trackInactiveSoloStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('that inactive solo streak activity gets updated and a solo streak tracking event is created', async () => {
        expect.assertions(1);
        streakoid.soloStreaks.update = jest.fn().mockResolvedValue({ data: {} });
        streakoid.streakTrackingEvents.create = jest.fn().mockResolvedValue(true);
        const _id = '1';
        const currentStreak = {
            startDate: '24/02/95',
            numberOfDaysInARow: 1,
        };
        const userId = 'userId';
        const inactiveSoloStreak = {
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
        const inactiveSoloStreaks = [inactiveSoloStreak];
        await trackInactiveSoloStreaks(inactiveSoloStreaks as any);

        expect(streakoid.streakTrackingEvents.create).toBeCalledWith({
            type: StreakTrackingEventType.InactiveStreak,
            streakId: _id,
            userId,
        });
    });
});
