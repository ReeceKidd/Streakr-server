/* eslint-disable @typescript-eslint/no-explicit-any */
import { trackMaintainedSoloStreaks } from './trackMaintainedSoloStreaks';
import streakoid from '../../streakoid';
import { StreakTypes, StreakTrackingEventTypes } from '@streakoid/streakoid-models/lib';
import { soloStreakModel } from '../../../src/Models/SoloStreak';

describe('trackMaintainedSoloStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('creates a streak tracking event for each streak that is maintained', async () => {
        expect.assertions(2);
        soloStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} });
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
        expect(soloStreakModel.findByIdAndUpdate).toBeCalledWith(_id, {
            $set: { completedToday: false },
        });
        expect(streakoid.streakTrackingEvents.create).toBeCalledWith({
            type: StreakTrackingEventTypes.maintainedStreak,
            streakId: _id,
            userId,
            streakType: StreakTypes.solo,
        });
    });
});
