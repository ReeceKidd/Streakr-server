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

describe('resetIncompleteSoloStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('that incomplete teamMemberStreaks default current streak is reset, past streak is pushed to past streaks, and the teamStreak the teamMemberStreak belongs to completed today gets set to false and lost streak activity is recorded', async () => {
        expect.assertions(5);
        const user = getMockUser({ _id: 'abc' });
        const teamStreak = getMockTeamStreak({ creatorId: user._id });
        const teamMemberStreak = getMockTeamMemberStreak({ teamStreakId: teamStreak._id, userId: user._id });
        teamMemberStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(teamMemberStreak) as any;
        teamStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(teamStreak) as any;
        userModel.findById = jest.fn().mockResolvedValue(user) as any;

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

        expect(userModel.findById).toBeCalledWith(teamMemberStreak.userId);

        expect(createActivityFeedItem).toBeCalledWith({
            activityFeedItemType: ActivityFeedItemTypes.lostTeamStreak,
            userId: user._id,
            username: user.username,
            userProfileImage: user.profileImages.originalImageUrl,
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
            numberOfDaysLost: teamStreak.currentStreak.numberOfDaysInARow,
        });

        expect(createStreakTrackingEvent).toBeCalledWith({
            type: StreakTrackingEventTypes.lostStreak,
            streakId: teamMemberStreak._id,
            userId: user._id,
            streakType: StreakTypes.teamMember,
        });
    });
});
