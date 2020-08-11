/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('../../helpers/createActivityFeedItem', () => ({
    __esModule: true,
    createActivityFeedItem: jest.fn().mockResolvedValue(true),
}));
jest.mock('../../helpers/createStreakTrackingEvent', () => ({
    __esModule: true,
    createStreakTrackingEvent: jest.fn().mockResolvedValue(true),
}));

import { resetIncompleteChallengeStreaks } from './resetIncompleteChallengeStreaks';
import { challengeStreakModel } from '../../../src/Models/ChallengeStreak';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { createActivityFeedItem } from '../../helpers/createActivityFeedItem';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';
import { userModel } from '../../Models/User';
import { getMockUser } from '../../testHelpers/getMockUser';
import { challengeModel } from '../../Models/Challenge';
import { getMockChallengeStreak } from '../../testHelpers/getMockChallengeStreak';
import { getMockChallenge } from '../../testHelpers/getMockChallenge';
import { LongestChallengeStreak } from '@streakoid/streakoid-models/lib/Models/LongestChallengeStreak';
import { UserStreakHelper } from '../../helpers/UserStreakHelper';

describe('resetIncompleteChallengeStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('that incomplete challenge streaks default current streak is reset and old streak is pushed to past streaks.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: 'abc' });
        const challenge = getMockChallenge();
        const incompleteChallengeStreak = getMockChallengeStreak({ user, challenge });
        challengeStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(incompleteChallengeStreak) as any;
        userModel.findById = jest.fn().mockResolvedValue(user) as any;
        UserStreakHelper.updateUsersLongestCurrentStreak = jest.fn().mockResolvedValue(true);
        challengeModel.findById = jest.fn().mockResolvedValue(challenge) as any;
        const endDate = new Date().toString();

        const incompleteChallengeStreaks = [incompleteChallengeStreak];
        const pastStreaks = [{ numberOfDaysInARow: 0, endDate, startDate: endDate }];
        await resetIncompleteChallengeStreaks(incompleteChallengeStreaks as any, endDate);

        expect(challengeStreakModel.findByIdAndUpdate).toBeCalledWith(incompleteChallengeStreak._id, {
            $set: {
                currentStreak: { startDate: '', numberOfDaysInARow: 0 },
                pastStreaks,
                active: false,
            },
        });
    });

    test('that users longestCurrentStreak is set to an empty objet if longestCurrentStreak.challengeStreak id equals challenge streak.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: 'abc' });
        const challenge = getMockChallenge();
        const incompleteChallengeStreak = getMockChallengeStreak({ user, challenge });
        challengeStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(incompleteChallengeStreak) as any;
        const longestCurrentStreak: LongestChallengeStreak = {
            challengeId: challenge._id,
            challengeName: challenge.name,
            challengeStreakId: incompleteChallengeStreak._id,
            numberOfDays: incompleteChallengeStreak.currentStreak.numberOfDaysInARow,
            startDate: new Date(),
        };
        userModel.findById = jest.fn().mockResolvedValue({ ...user, longestCurrentStreak }) as any;
        UserStreakHelper.updateUsersLongestCurrentStreak = jest.fn().mockResolvedValue(true);
        challengeModel.findById = jest.fn().mockResolvedValue(challenge) as any;
        const endDate = new Date().toString();

        const incompleteChallengeStreaks = [incompleteChallengeStreak];

        await resetIncompleteChallengeStreaks(incompleteChallengeStreaks as any, endDate);

        expect(UserStreakHelper.updateUsersLongestCurrentStreak).toBeCalledWith({ userId: user._id });
    });

    test('that create activity feed item is created.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: 'abc' });
        const challenge = getMockChallenge();
        const incompleteChallengeStreak = getMockChallengeStreak({ user, challenge });
        challengeStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(incompleteChallengeStreak) as any;
        userModel.findById = jest.fn().mockResolvedValue(user) as any;
        UserStreakHelper.updateUsersLongestCurrentStreak = jest.fn().mockResolvedValue(true);
        challengeModel.findById = jest.fn().mockResolvedValue(challenge) as any;
        const endDate = new Date().toString();

        const incompleteChallengeStreaks = [incompleteChallengeStreak];
        await resetIncompleteChallengeStreaks(incompleteChallengeStreaks as any, endDate);

        expect(createActivityFeedItem).toBeCalledWith({
            activityFeedItemType: ActivityFeedItemTypes.lostChallengeStreak,
            userId: user._id,
            username: getMockUser({ _id: 'abc' }).username,
            userProfileImage: getMockUser({ _id: 'abc' }).profileImages.originalImageUrl,
            challengeStreakId: incompleteChallengeStreak._id,
            challengeId: challenge._id,
            challengeName: challenge.name,
            numberOfDaysLost: incompleteChallengeStreak.currentStreak.numberOfDaysInARow,
        });
    });

    test('that streak tracking event is created.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: 'abc' });
        const challenge = getMockChallenge();
        const incompleteChallengeStreak = getMockChallengeStreak({ user, challenge });
        challengeStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(incompleteChallengeStreak) as any;
        userModel.findById = jest.fn().mockResolvedValue(user) as any;
        UserStreakHelper.updateUsersLongestCurrentStreak = jest.fn().mockResolvedValue(true);
        challengeModel.findById = jest.fn().mockResolvedValue(challenge) as any;
        const endDate = new Date().toString();

        const incompleteChallengeStreaks = [incompleteChallengeStreak];
        await resetIncompleteChallengeStreaks(incompleteChallengeStreaks as any, endDate);

        expect(createStreakTrackingEvent).toBeCalledWith({
            type: StreakTrackingEventTypes.lostStreak,
            streakId: incompleteChallengeStreak._id,
            userId: user._id,
            streakType: StreakTypes.challenge,
        });
    });
});
