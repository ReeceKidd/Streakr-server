/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('../../helpers/createStreakTrackingEvent', () => ({
    __esModule: true,
    createStreakTrackingEvent: jest.fn().mockResolvedValue(true),
}));
import { trackMaintainedTeamStreaks } from './trackMaintainedTeamStreaks';
import { teamStreakModel } from '../../../src/Models/TeamStreak';
import { userModel } from '../../../src/Models/User';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';
import { getMockUser } from '../../testHelpers/getMockUser';
import { getMockTeamStreak } from '../../testHelpers/getMockTeamStreak';
import { LongestTeamStreak } from '@streakoid/streakoid-models/lib/Models/LongestTeamStreak';

describe('trackMaintainedTeamStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('if current streak is longer than the longestTeamStreak it updates the longest team streak for the team streak and sets the team streak completed today to false. For each of the members it sets the longest streak and then creates a streak tracking event for each streak that is maintained', async () => {
        expect.assertions(3);
        const user = getMockUser({ _id: '_id' });
        teamStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(getMockUser({ _id: '_id' })) as any;
        const currentStreak = {
            startDate: new Date().toString(),
            numberOfDaysInARow: 1,
        };
        const teamStreak = { ...getMockTeamStreak({ creatorId: user._id }), currentStreak };
        const maintainedTeamStreaks = [teamStreak];
        await trackMaintainedTeamStreaks(maintainedTeamStreaks as any);
        const longestTeamStreak: LongestTeamStreak = {
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
            members: teamStreak.members,
            numberOfDays: teamStreak.currentStreak.numberOfDaysInARow,
            startDate: new Date(teamStreak.currentStreak.startDate),
        };
        expect(teamStreakModel.findByIdAndUpdate).toBeCalledWith(teamStreak._id, {
            $set: { longestTeamStreak, completedToday: false },
        });
        expect(userModel.findByIdAndUpdate).toBeCalledWith(user._id, { $set: { longestTeamStreak } });
        expect(createStreakTrackingEvent).toBeCalledWith({
            type: StreakTrackingEventTypes.maintainedStreak,
            streakId: teamStreak._id,
            streakType: StreakTypes.team,
        });
    });

    test('if current streak is not longer than the longestTeamStreak it sets the team streak completed today to false and creates the streakTrackingEvent', async () => {
        expect.assertions(2);
        const user = getMockUser({ _id: '_id' });
        teamStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(getMockUser({ _id: '_id' })) as any;
        const currentStreak = {
            startDate: new Date().toString(),
            numberOfDaysInARow: 1,
        };
        const teamStreak = { ...getMockTeamStreak({ creatorId: user._id }), currentStreak };
        const longestTeamStreak: LongestTeamStreak = {
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
            members: teamStreak.members,
            numberOfDays: 100,
            startDate: new Date(),
        };

        const maintainedTeamStreaks = [{ ...teamStreak, longestTeamStreak }];
        await trackMaintainedTeamStreaks(maintainedTeamStreaks as any);

        expect(teamStreakModel.findByIdAndUpdate).toBeCalledWith(teamStreak._id, {
            $set: { completedToday: false },
        });
        expect(createStreakTrackingEvent).toBeCalledWith({
            type: StreakTrackingEventTypes.maintainedStreak,
            streakId: teamStreak._id,
            streakType: StreakTypes.team,
        });
    });
});
