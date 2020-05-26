/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('../../helpers/createStreakTrackingEvent', () => ({
    __esModule: true,
    createStreakTrackingEvent: jest.fn().mockResolvedValue(true),
}));
import { trackInactiveSoloStreaks } from './trackInactiveSoloStreaks';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';

describe('trackInactiveSoloStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('that inactive solo streak activity gets updated and a solo streak tracking event is created', async () => {
        expect.assertions(1);
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

        expect(createStreakTrackingEvent).toBeCalledWith({
            type: StreakTrackingEventTypes.inactiveStreak,
            streakId: _id,
            userId,
            streakType: StreakTypes.solo,
        });
    });
});
