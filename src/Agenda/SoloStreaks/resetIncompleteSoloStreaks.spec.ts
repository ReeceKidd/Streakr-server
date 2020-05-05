/* eslint-disable @typescript-eslint/no-explicit-any */
import { resetIncompleteSoloStreaks } from './resetIncompleteSoloStreaks';
import streakoid from '../../streakoid';
import { soloStreakModel } from '../../../src/Models/SoloStreak';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

describe('resetIncompleteSoloStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('that incomplete solo streaks default current streak is reset and old streak is pushed to past streaks and lost streak activity is recorded', async () => {
        expect.assertions(3);
        soloStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(true) as any;
        streakoid.streakTrackingEvents.create = jest.fn().mockResolvedValue(true);
        streakoid.activityFeedItems.create = jest.fn().mockResolvedValue(true);
        const username = 'username';
        const originalImageUrl = 'google.com/image';
        streakoid.users.getOne = jest.fn().mockResolvedValue({ username, profileImages: { originalImageUrl } });
        const _id = '1234';
        const endDate = new Date().toString();
        const currentStreak = {
            startDate: undefined,
            numberOfDaysInARow: 0,
        };
        const userId = '5c35116059f7ba19e4e248a9';
        const incompleteSoloStreaks = [
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
        await resetIncompleteSoloStreaks(incompleteSoloStreaks as any, endDate);

        expect(soloStreakModel.findByIdAndUpdate).toBeCalledWith(_id, {
            $set: {
                currentStreak: { startDate: '', numberOfDaysInARow: 0 },
                pastStreaks,
                active: false,
            },
        });

        expect(streakoid.activityFeedItems.create).toBeCalledWith({
            activityFeedItemType: ActivityFeedItemTypes.lostSoloStreak,
            userId,
            username,
            userProfileImage: originalImageUrl,
            soloStreakId: _id,
            soloStreakName: incompleteSoloStreaks[0].streakName,
            numberOfDaysLost: currentStreak.numberOfDaysInARow,
        });

        expect(streakoid.streakTrackingEvents.create).toBeCalledWith({
            type: StreakTrackingEventTypes.lostStreak,
            streakId: _id,
            userId,
            streakType: StreakTypes.solo,
        });
    });
});
