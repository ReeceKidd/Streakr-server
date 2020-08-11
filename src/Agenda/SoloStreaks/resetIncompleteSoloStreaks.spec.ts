/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('../../helpers/createActivityFeedItem', () => ({
    __esModule: true,
    createActivityFeedItem: jest.fn().mockResolvedValue(true),
}));
jest.mock('../../helpers/createStreakTrackingEvent', () => ({
    __esModule: true,
    createStreakTrackingEvent: jest.fn().mockResolvedValue(true),
}));

import { resetIncompleteSoloStreaks } from './resetIncompleteSoloStreaks';
import { soloStreakModel } from '../../../src/Models/SoloStreak';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { createActivityFeedItem } from '../../helpers/createActivityFeedItem';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';
import { userModel } from '../../Models/User';
import { getMockUser } from '../../testHelpers/getMockUser';
import { getMockSoloStreak } from '../../testHelpers/getMockSoloStreak';
import { LongestSoloStreak } from '@streakoid/streakoid-models/lib/Models/LongestSoloStreak';
import { UserStreakHelper } from '../../helpers/UserStreakHelper';

describe('resetIncompleteSoloStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('that incomplete solo streaks default current streak is reset and old streak is pushed to past streaks', async () => {
        expect.assertions(1);
        soloStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(true) as any;
        const user = getMockUser({ _id: 'abc' });
        const incompleteSoloStreak = getMockSoloStreak({ userId: user._id });
        userModel.findById = jest.fn().mockResolvedValue(user) as any;
        UserStreakHelper.updateUsersLongestCurrentStreak = jest.fn().mockResolvedValue(true);
        const endDate = new Date().toString();

        const incompleteSoloStreaks = [incompleteSoloStreak];
        const pastStreaks = [{ numberOfDaysInARow: 0, endDate, startDate: endDate }];
        await resetIncompleteSoloStreaks(incompleteSoloStreaks as any, endDate);

        expect(soloStreakModel.findByIdAndUpdate).toBeCalledWith(incompleteSoloStreak._id, {
            $set: {
                currentStreak: { startDate: '', numberOfDaysInARow: 0 },
                pastStreaks,
                active: false,
            },
        });
    });

    test('that users longestCurrentStreak is set to an empty object if longestCurrentStreak.soloStreak id equals current solo streak.', async () => {
        expect.assertions(1);
        soloStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(true) as any;
        const user = getMockUser({ _id: 'abc' });
        const incompleteSoloStreak = getMockSoloStreak({ userId: user._id });
        const longestCurrentStreak: LongestSoloStreak = {
            soloStreakId: incompleteSoloStreak._id,
            soloStreakName: incompleteSoloStreak.streakName,
            numberOfDays: incompleteSoloStreak.currentStreak.numberOfDaysInARow,
            startDate: new Date(),
        };
        userModel.findById = jest.fn().mockResolvedValue({ ...user, longestCurrentStreak }) as any;
        UserStreakHelper.updateUsersLongestCurrentStreak = jest.fn().mockResolvedValue(true);
        const endDate = new Date().toString();

        const incompleteSoloStreaks = [incompleteSoloStreak];
        await resetIncompleteSoloStreaks(incompleteSoloStreaks as any, endDate);

        expect(UserStreakHelper.updateUsersLongestCurrentStreak).toBeCalledWith({ userId: user._id });
    });

    test('that lostStreakActivityFeedItem is created', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: 'abc' });
        const incompleteSoloStreak = getMockSoloStreak({ userId: user._id });
        soloStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(incompleteSoloStreak) as any;
        userModel.findById = jest.fn().mockResolvedValue(user) as any;
        UserStreakHelper.updateUsersLongestCurrentStreak = jest.fn().mockResolvedValue(true);
        const endDate = new Date().toString();
        const currentStreak = {
            startDate: undefined,
            numberOfDaysInARow: 0,
        };

        const incompleteSoloStreaks = [incompleteSoloStreak];
        await resetIncompleteSoloStreaks(incompleteSoloStreaks as any, endDate);

        expect(createActivityFeedItem).toBeCalledWith({
            activityFeedItemType: ActivityFeedItemTypes.lostSoloStreak,
            userId: user._id,
            username: user.username,
            userProfileImage: user.profileImages.originalImageUrl,
            soloStreakId: incompleteSoloStreak._id,
            soloStreakName: incompleteSoloStreaks[0].streakName,
            numberOfDaysLost: currentStreak.numberOfDaysInARow,
        });
    });

    test('that lost streak streak tracking event is created.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: 'abc' });
        const incompleteSoloStreak = getMockSoloStreak({ userId: user._id });
        soloStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(incompleteSoloStreak) as any;
        userModel.findById = jest.fn().mockResolvedValue(user) as any;
        UserStreakHelper.updateUsersLongestCurrentStreak = jest.fn().mockResolvedValue(true);
        const endDate = new Date().toString();

        const incompleteSoloStreaks = [incompleteSoloStreak];
        await resetIncompleteSoloStreaks(incompleteSoloStreaks as any, endDate);

        expect(createStreakTrackingEvent).toBeCalledWith({
            type: StreakTrackingEventTypes.lostStreak,
            streakId: incompleteSoloStreak._id,
            userId: user._id,
            streakType: StreakTypes.solo,
        });
    });
});
