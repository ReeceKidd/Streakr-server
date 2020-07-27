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
import { userModel } from '../../Models/User';
import { getMockUser } from '../../testHelpers/getMockUser';
import { getMockSoloStreak } from '../../testHelpers/getMockSoloStreak';

describe('trackMaintainedSoloStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('sets completed today to false when streak is maintained.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: 'userId' });
        soloStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        userModel.findById = jest.fn().mockResolvedValue(user) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;
        const currentStreak = {
            startDate: '24/02/95',
            numberOfDaysInARow: 1,
        };
        const userId = '5c35116059f7ba19e4e248a9';
        const soloStreak = { ...getMockSoloStreak({ userId }), currentStreak };
        const maintainedSoloStreaks = [soloStreak];
        await trackMaintainedSoloStreaks(maintainedSoloStreaks as any);
        expect(soloStreakModel.findByIdAndUpdate).toBeCalledWith(soloStreak._id, {
            $set: { completedToday: false },
        });
    });

    test('if solo streak current streak is longer than the users longest ever streak it updates the users longest ever streak.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: 'userId' });
        soloStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        userModel.findById = jest.fn().mockResolvedValue(user) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;

        const currentStreak = {
            startDate: '24/02/95',
            numberOfDaysInARow: 100,
        };
        const soloStreak = { ...getMockSoloStreak({ userId: user._id }), currentStreak };
        const maintainedSoloStreaks = [soloStreak];
        await trackMaintainedSoloStreaks(maintainedSoloStreaks as any);
        expect(userModel.findByIdAndUpdate).toBeCalledWith(user._id, {
            $set: {
                longestEverStreak: {
                    soloStreakId: soloStreak._id,
                    soloStreakName: soloStreak.streakName,
                    numberOfDays: soloStreak.currentStreak.numberOfDaysInARow,
                    startDate: soloStreak.currentStreak.startDate,
                },
            },
        });
    });

    test('if solo streak current streak is not longer than the users longest ever streak the users longestEverStreak is not updated.', async () => {
        expect.assertions(1);
        const user = { ...getMockUser({ _id: 'userId' }), longestEverStreak: { numberOfDays: 100 } };
        soloStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        userModel.findById = jest.fn().mockResolvedValue(user) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;

        const currentStreak = {
            startDate: '24/02/95',
            numberOfDaysInARow: 1,
        };
        const soloStreak = { ...getMockSoloStreak({ userId: user._id }), currentStreak };
        const maintainedSoloStreaks = [soloStreak];
        await trackMaintainedSoloStreaks(maintainedSoloStreaks as any);
        expect(userModel.findByIdAndUpdate).not.toBeCalled();
    });

    test('creates a streak tracking event for each streak that is maintained', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: 'userId' });
        soloStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        userModel.findById = jest.fn().mockResolvedValue(user) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;

        const currentStreak = {
            startDate: '24/02/95',
            numberOfDaysInARow: 1,
        };

        const soloStreak = { ...getMockSoloStreak({ userId: user._id }), currentStreak };
        const maintainedSoloStreaks = [soloStreak];
        await trackMaintainedSoloStreaks(maintainedSoloStreaks as any);
        expect(createStreakTrackingEvent).toBeCalledWith({
            type: StreakTrackingEventTypes.maintainedStreak,
            streakId: soloStreak._id,
            userId: user._id,
            streakType: StreakTypes.solo,
        });
    });
});
