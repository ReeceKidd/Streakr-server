/* eslint-disable @typescript-eslint/no-explicit-any */
import { trackMaintainedSoloStreaks } from './trackMaintainedSoloStreaks';
import streakoid from '../../streakoid';
import StreakTrackingEventType from '@streakoid/streakoid-sdk/lib/streakTrackingEventType';

describe('trackMaintainedSoloStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('that maintained solo streak activity gets updated and a solo streak tracking event is created', async () => {
        expect.assertions(2);
        streakoid.soloStreaks.update = jest.fn().mockResolvedValue({ data: {} });
        streakoid.streakTrackingEvents.create = jest.fn().mockResolvedValue(true);
        const _id = 1;
        const currentStreak = {
            startDate: '24/02/95',
            numberOfDaysInARow: 1,
        };
        const userId = '5c35116059f7ba19e4e248a9';
        const maintainedSoloStreaks = [
            {
                _id,
                currentStreak,
                startDate: new Date(),
                completedToday: true,
                activity: [],
                pastStreaks: [],
                streakName: 'Daily Danish',
                streakDescription: 'Each day I must do Danish',
                userId,
                timezone: 'Europe/London',
                createdAt: new Date(),
                updatedAt: new Date(),
            } as any,
        ];
        await trackMaintainedSoloStreaks(maintainedSoloStreaks as any);
        expect(streakoid.soloStreaks.update).toBeCalledWith({
            soloStreakId: _id,
            updateData: {
                completedToday: false,
            },
        });
        expect(streakoid.streakTrackingEvents.create).toBeCalledWith({
            type: StreakTrackingEventType.MaintainedStreak,
            streakId: _id,
            userId,
        });
    });
});
