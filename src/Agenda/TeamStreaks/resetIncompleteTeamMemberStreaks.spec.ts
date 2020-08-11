/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('../../helpers/createActivityFeedItem', () => ({
    __esModule: true,
    createActivityFeedItem: jest.fn().mockResolvedValue(true),
}));
jest.mock('../../helpers/createStreakTrackingEvent', () => ({
    __esModule: true,
    createStreakTrackingEvent: jest.fn().mockResolvedValue(true),
}));
import { resetIncompleteTeamMemberStreaks } from './resetIncompleteTeamMemberStreaks';
import { teamMemberStreakModel } from '../../../src/Models/TeamMemberStreak';
import { teamStreakModel } from '../../../src/Models/TeamStreak';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { createActivityFeedItem } from '../../helpers/createActivityFeedItem';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';
import { userModel } from '../../Models/User';
import { getMockUser } from '../../testHelpers/getMockUser';
import { getMockTeamMemberStreak } from '../../testHelpers/getMockTeamMemberStreak';
import { getMockTeamStreak } from '../../testHelpers/getMockTeamStreak';
import { LongestTeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/LongestTeamMemberStreak';
import { UserStreakHelper } from '../../helpers/UserStreakHelper';

describe('resetIncompleteSoloStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('that incomplete teamMemberStreaks default current streak is reset and past streak is pushed to past streaks, and the teamStreak the teamMemberStreak belongs to completed today gets set to false.', async () => {
        expect.assertions(2);
        const user = getMockUser({ _id: 'abc' });
        const teamStreak = getMockTeamStreak({ creatorId: user._id });
        const teamMemberStreak = getMockTeamMemberStreak({ teamStreakId: teamStreak._id, userId: user._id });
        teamMemberStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(teamMemberStreak) as any;
        teamStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(teamStreak) as any;
        userModel.findById = jest.fn().mockResolvedValue(user) as any;
        UserStreakHelper.updateUsersLongestCurrentStreak = jest.fn().mockResolvedValue(true);

        const incompleteTeamMemberStreaks = [teamMemberStreak];

        const endDate = new Date().toString();

        await resetIncompleteTeamMemberStreaks(incompleteTeamMemberStreaks as any, endDate);

        const pastStreaks = [{ numberOfDaysInARow: 0, endDate, startDate: endDate }];

        expect(teamMemberStreakModel.findByIdAndUpdate).toBeCalledWith(teamMemberStreak._id, {
            $set: {
                currentStreak: { startDate: '', numberOfDaysInARow: 0 },
                pastStreaks,
                active: false,
            },
        });

        expect(teamStreakModel.findByIdAndUpdate).toBeCalledWith(teamMemberStreak.teamStreakId, {
            $set: {
                completedToday: false,
            },
        });
    });

    test('that users longestCurrentStreak is set to an empty object if longestCurrentStreak.teamMemberStreak id equals team member streak.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: 'abc' });
        const teamStreak = getMockTeamStreak({ creatorId: user._id });
        const teamMemberStreak = getMockTeamMemberStreak({ teamStreakId: teamStreak._id, userId: user._id });
        teamMemberStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(teamMemberStreak) as any;
        teamStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(teamStreak) as any;
        const longestCurrentStreak: LongestTeamMemberStreak = {
            teamStreakId: teamStreak._id,
            teamMemberStreakId: teamMemberStreak._id,
            teamStreakName: teamStreak.streakName,
            numberOfDays: teamMemberStreak.currentStreak.numberOfDaysInARow,
            startDate: new Date(),
        };
        userModel.findById = jest.fn().mockResolvedValue({ ...user, longestCurrentStreak }) as any;
        UserStreakHelper.updateUsersLongestCurrentStreak = jest.fn().mockResolvedValue(true);

        const incompleteTeamMemberStreaks = [teamMemberStreak];

        const endDate = new Date().toString();

        await resetIncompleteTeamMemberStreaks(incompleteTeamMemberStreaks as any, endDate);

        expect(UserStreakHelper.updateUsersLongestCurrentStreak).toBeCalledWith({ userId: user._id });
    });

    test('creates a lost team member streak activity feed item.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: 'abc' });
        const teamStreak = getMockTeamStreak({ creatorId: user._id });
        const teamMemberStreak = getMockTeamMemberStreak({ teamStreakId: teamStreak._id, userId: user._id });
        teamMemberStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(teamMemberStreak) as any;
        teamStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(teamStreak) as any;
        userModel.findById = jest.fn().mockResolvedValue(user) as any;
        UserStreakHelper.updateUsersLongestCurrentStreak = jest.fn().mockResolvedValue(true);

        const incompleteTeamMemberStreaks = [teamMemberStreak];

        const endDate = new Date().toString();

        await resetIncompleteTeamMemberStreaks(incompleteTeamMemberStreaks as any, endDate);

        expect(createActivityFeedItem).toBeCalledWith({
            activityFeedItemType: ActivityFeedItemTypes.lostTeamStreak,
            userId: user._id,
            username: user.username,
            userProfileImage: user.profileImages.originalImageUrl,
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
            numberOfDaysLost: teamStreak.currentStreak.numberOfDaysInARow,
        });
    });

    test('creates a lost team member streak tracking event.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: 'abc' });
        const teamStreak = getMockTeamStreak({ creatorId: user._id });
        const teamMemberStreak = getMockTeamMemberStreak({ teamStreakId: teamStreak._id, userId: user._id });
        teamMemberStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(teamMemberStreak) as any;
        teamStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(teamStreak) as any;
        userModel.findById = jest.fn().mockResolvedValue(user) as any;
        UserStreakHelper.updateUsersLongestCurrentStreak = jest.fn().mockResolvedValue(true);

        const incompleteTeamMemberStreaks = [teamMemberStreak];

        const endDate = new Date().toString();

        await resetIncompleteTeamMemberStreaks(incompleteTeamMemberStreaks as any, endDate);

        expect(createStreakTrackingEvent).toBeCalledWith({
            type: StreakTrackingEventTypes.lostStreak,
            streakId: teamMemberStreak._id,
            userId: user._id,
            streakType: StreakTypes.teamMember,
        });
    });
});
