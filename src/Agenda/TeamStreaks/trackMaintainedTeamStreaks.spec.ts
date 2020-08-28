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

    test('it creates a maintained team streak tracking event when function is completed. .', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: '_id' });
        userModel.findById = jest.fn().mockResolvedValue(getMockUser({ _id: '_id' })) as any;
        teamStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(getMockUser({ _id: '_id' })) as any;
        const currentStreak = {
            startDate: new Date().toString(),
            numberOfDaysInARow: 1,
        };
        const teamStreak = { ...getMockTeamStreak({ creatorId: user._id }), currentStreak };
        const longestTeamStreak = {
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
            members: teamStreak.members,
            numberOfDays: 100,
            startDate: new Date(),
        };

        const maintainedTeamStreaks = [{ ...teamStreak, longestTeamStreak }];
        await trackMaintainedTeamStreaks(maintainedTeamStreaks as any);

        expect(createStreakTrackingEvent).toBeCalledWith({
            type: StreakTrackingEventTypes.maintainedStreak,
            streakId: teamStreak._id,
            streakType: StreakTypes.team,
        });
    });

    test('if current team streak is longer than the team streaks longestTeamStreak it updates the longestTeamStreak for the team streak and sets the team streak completed today to false.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: '_id' });
        teamStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(getMockUser({ _id: '_id' })) as any;
        userModel.findById = jest.fn().mockResolvedValue(getMockUser({ _id: '_id' })) as any;
        const currentStreak = {
            startDate: new Date().toString(),
            numberOfDaysInARow: 1,
        };
        const teamStreak = { ...getMockTeamStreak({ creatorId: user._id }), currentStreak };
        const maintainedTeamStreaks = [teamStreak];
        await trackMaintainedTeamStreaks(maintainedTeamStreaks as any);
        const longestTeamStreak = {
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
            members: teamStreak.members,
            numberOfDays: teamStreak.currentStreak.numberOfDaysInARow,
            startDate: teamStreak.currentStreak.startDate,
            streakType: StreakTypes.team,
        };
        expect(teamStreakModel.findByIdAndUpdate).toBeCalledWith(teamStreak._id, {
            $set: { longestTeamStreak },
        });
    });

    test('if current team streak is not longer than the team streaks longestTeamStreak it just sets the team streak completed today to false.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: '_id' });
        teamStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(getMockUser({ _id: '_id' })) as any;
        userModel.findById = jest.fn().mockResolvedValue(getMockUser({ _id: '_id' })) as any;
        const currentStreak = {
            startDate: new Date().toString(),
            numberOfDaysInARow: 1,
        };
        const teamStreak = { ...getMockTeamStreak({ creatorId: user._id }), currentStreak };
        const longestTeamStreak = {
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
            members: teamStreak.members,
            numberOfDays: 100,
            startDate: new Date(),
            streakType: StreakTypes.team,
        };

        const maintainedTeamStreaks = [{ ...teamStreak, longestTeamStreak }];
        await trackMaintainedTeamStreaks(maintainedTeamStreaks as any);

        expect(teamStreakModel.findByIdAndUpdate).toBeCalledWith(teamStreak._id, {
            $set: { completedToday: false },
        });
    });

    test('if the team members longestTeamStreak is less than the team streaks current streak it updates the longestTeamStreak for the member.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: '_id' });
        teamStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(getMockUser({ _id: '_id' })) as any;
        userModel.findById = jest.fn().mockResolvedValue(getMockUser({ _id: '_id' })) as any;
        const currentStreak = {
            startDate: new Date().toString(),
            numberOfDaysInARow: 11,
        };
        const teamStreak = { ...getMockTeamStreak({ creatorId: user._id }), currentStreak };
        const longestTeamStreak: LongestTeamStreak = {
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
            members: teamStreak.members,
            numberOfDays: 10,
            startDate: new Date(),
        };

        const maintainedTeamStreaks = [{ ...teamStreak, longestTeamStreak }];
        await trackMaintainedTeamStreaks(maintainedTeamStreaks as any);

        expect(userModel.findByIdAndUpdate).toBeCalledWith(teamStreak.members[0].memberId, {
            $set: {
                longestTeamStreak: {
                    teamStreakId: teamStreak._id,
                    teamStreakName: teamStreak.streakName,
                    numberOfDays: teamStreak.currentStreak.numberOfDaysInARow,
                    startDate: expect.any(String),
                    members: teamStreak.members,
                    streakType: StreakTypes.team,
                },
            },
        });
    });

    test('if the team members longestEverStreak is less than the team streaks current streak it updates the longestEverStreak for the member.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: '_id' });
        teamStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(getMockUser({ _id: '_id' })) as any;
        userModel.findById = jest.fn().mockResolvedValue(getMockUser({ _id: '_id' })) as any;
        const currentStreak = {
            startDate: new Date().toString(),
            numberOfDaysInARow: 11,
        };
        const teamStreak = { ...getMockTeamStreak({ creatorId: user._id }), currentStreak };
        const longestTeamStreak: LongestTeamStreak = {
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
            members: teamStreak.members,
            numberOfDays: 10,
            startDate: new Date(),
        };

        const maintainedTeamStreaks = [{ ...teamStreak, longestTeamStreak }];
        await trackMaintainedTeamStreaks(maintainedTeamStreaks as any);

        expect(userModel.findByIdAndUpdate).toBeCalledWith(teamStreak.members[0].memberId, {
            $set: {
                longestEverStreak: {
                    teamStreakId: teamStreak._id,
                    teamStreakName: teamStreak.streakName,
                    numberOfDays: teamStreak.currentStreak.numberOfDaysInARow,
                    startDate: expect.any(String),
                    members: teamStreak.members,
                    streakType: StreakTypes.team,
                },
            },
        });
    });
});
