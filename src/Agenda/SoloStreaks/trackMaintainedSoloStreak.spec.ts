/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('../../helpers/createStreakTrackingEvent', () => ({
    __esModule: true,
    createStreakTrackingEvent: jest.fn().mockResolvedValue(true),
}));
import { trackMaintainedSoloStreaks } from './trackMaintainedSoloStreaks';
import { soloStreakModel } from '../../../src/Models/SoloStreak';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';

describe('trackMaintainedSoloStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('creates a streak tracking event for each streak that is maintained', async () => {
        expect.assertions(2);
        soloStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
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
        expect(createStreakTrackingEvent).toBeCalledWith({
            type: StreakTrackingEventTypes.maintainedStreak,
            streakId: _id,
            userId,
            streakType: StreakTypes.solo,
        });
    });
});
