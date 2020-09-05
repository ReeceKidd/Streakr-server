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
import { UserStreakHelper } from '../../helpers/UserStreakHelper';
import { LongestCurrentTeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/LongestCurrentTeamMemberStreak';
import { LongestEverStreak } from '@streakoid/streakoid-models/lib/Models/LongestEverStreak';

describe('resetIncompleteSoloStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('that incomplete teamMemberStreaks default current streak is reset and past streak is pushed to past streaks, and the teamStreak the teamMemberStreak belongs to completed today gets set to false.', async () => {
        expect.assertions(2);
        const user = getMockUser({ _id: 'abc' });
        const teamStreak = getMockTeamStreak({ creatorId: user._id });
        const teamMemberStreak = getMockTeamMemberStreak({ teamStreak, user });
        teamMemberStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(teamMemberStreak) as any;
        teamStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(teamStreak) as any;
        userModel.findById = jest.fn().mockResolvedValue(user) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;
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
        const teamMemberStreak = getMockTeamMemberStreak({ teamStreak, user });
        teamMemberStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(teamMemberStreak) as any;
        teamStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(teamStreak) as any;
        const longestCurrentStreak: LongestCurrentTeamMemberStreak = {
            teamStreakId: teamStreak._id,
            teamMemberStreakId: teamMemberStreak._id,
            teamStreakName: teamStreak.streakName,
            numberOfDays: teamMemberStreak.currentStreak.numberOfDaysInARow,
            startDate: new Date().toString(),
            streakType: StreakTypes.teamMember,
        };
        userModel.findById = jest.fn().mockResolvedValue({ ...user, longestCurrentStreak }) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;
        UserStreakHelper.updateUsersLongestCurrentStreak = jest.fn().mockResolvedValue(true);

        const incompleteTeamMemberStreaks = [teamMemberStreak];

        const endDate = new Date().toString();

        await resetIncompleteTeamMemberStreaks(incompleteTeamMemberStreaks as any, endDate);

        expect(UserStreakHelper.updateUsersLongestCurrentStreak).toBeCalledWith({ userId: user._id });
    });

    test('that users longestCurrentStreak is set to an empty object if longestCurrentStreak.teamMemberStreak id equals team member streak.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: 'abc' });
        const teamStreak = getMockTeamStreak({ creatorId: user._id });
        const teamMemberStreak = getMockTeamMemberStreak({ teamStreak, user });
        teamMemberStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(teamMemberStreak) as any;
        teamStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(teamStreak) as any;
        const longestCurrentStreak: LongestCurrentTeamMemberStreak = {
            teamStreakId: teamStreak._id,
            teamMemberStreakId: teamMemberStreak._id,
            teamStreakName: teamStreak.streakName,
            numberOfDays: teamMemberStreak.currentStreak.numberOfDaysInARow,
            startDate: new Date().toString(),
            streakType: StreakTypes.teamMember,
        };
        userModel.findById = jest.fn().mockResolvedValue({ ...user, longestCurrentStreak }) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;
        UserStreakHelper.updateUsersLongestCurrentStreak = jest.fn().mockResolvedValue(true);

        const incompleteTeamMemberStreaks = [teamMemberStreak];

        const endDate = new Date().toString();

        await resetIncompleteTeamMemberStreaks(incompleteTeamMemberStreaks as any, endDate);

        expect(UserStreakHelper.updateUsersLongestCurrentStreak).toBeCalledWith({ userId: user._id });
    });

    test('if the current streak is equal to the users longestEverStreak an end date is added to the longestEverStreak.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: 'abc' });
        const teamStreak = getMockTeamStreak({ creatorId: user._id });
        const teamMemberStreak = getMockTeamMemberStreak({ teamStreak, user });
        teamMemberStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(teamMemberStreak) as any;
        teamStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(teamStreak) as any;
        const longestEverStreak: LongestCurrentTeamMemberStreak = {
            teamStreakId: teamStreak._id,
            teamMemberStreakId: teamMemberStreak._id,
            teamStreakName: teamStreak.streakName,
            numberOfDays: teamMemberStreak.currentStreak.numberOfDaysInARow,
            startDate: new Date().toString(),
            streakType: StreakTypes.teamMember,
        };
        userModel.findById = jest.fn().mockResolvedValue({ ...user, longestEverStreak }) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;
        UserStreakHelper.updateUsersLongestCurrentStreak = jest.fn().mockResolvedValue(true);

        const incompleteTeamMemberStreaks = [teamMemberStreak];

        const endDate = new Date().toString();

        await resetIncompleteTeamMemberStreaks(incompleteTeamMemberStreaks as any, endDate);

        expect(userModel.findByIdAndUpdate).toBeCalledWith(user._id, {
            $set: { longestEverStreak: { ...longestEverStreak, endDate } },
        });
    });

    test('if the current streak is equal to the users longestTeamMemberStreak an end date is added to the longestTeamMemberStreak.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: 'abc' });
        const teamStreak = getMockTeamStreak({ creatorId: user._id });
        const teamMemberStreak = getMockTeamMemberStreak({ teamStreak, user });
        teamMemberStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(teamMemberStreak) as any;
        teamStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(teamStreak) as any;
        const longestTeamMemberStreak: LongestEverStreak = {
            teamStreakId: teamStreak._id,
            teamMemberStreakId: teamMemberStreak._id,
            teamStreakName: teamStreak.streakName,
            numberOfDays: teamMemberStreak.currentStreak.numberOfDaysInARow,
            startDate: new Date().toString(),
            streakType: StreakTypes.teamMember,
        };
        userModel.findById = jest.fn().mockResolvedValue({ ...user, longestTeamMemberStreak }) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;
        UserStreakHelper.updateUsersLongestCurrentStreak = jest.fn().mockResolvedValue(true);

        const incompleteTeamMemberStreaks = [teamMemberStreak];

        const endDate = new Date().toString();

        await resetIncompleteTeamMemberStreaks(incompleteTeamMemberStreaks as any, endDate);

        expect(userModel.findByIdAndUpdate).toBeCalledWith(user._id, {
            $set: { longestTeamMemberStreak: { ...longestTeamMemberStreak, endDate } },
        });
    });

    test('creates a lost team member streak activity feed item.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: 'abc' });
        const teamStreak = getMockTeamStreak({ creatorId: user._id });
        const teamMemberStreak = getMockTeamMemberStreak({ teamStreak, user });
        teamMemberStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(teamMemberStreak) as any;
        teamStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue(teamStreak) as any;
        userModel.findById = jest.fn().mockResolvedValue(user) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;
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
        const teamMemberStreak = getMockTeamMemberStreak({ teamStreak, user });
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
