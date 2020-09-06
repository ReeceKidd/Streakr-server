/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('../../helpers/createStreakTrackingEvent', () => ({
    __esModule: true,
    createStreakTrackingEvent: jest.fn().mockResolvedValue(true),
}));
import { resetIncompleteTeamStreaks } from './resetIncompleteTeamStreaks';
import { teamStreakModel } from '../../../src/Models/TeamStreak';
import { teamMemberStreakModel } from '../../../src/Models/TeamMemberStreak';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';
import { userModel } from '../../Models/User';
import { getMockUser } from '../../testHelpers/getMockUser';
import { LongestEverTeamStreak } from '@streakoid/streakoid-models/lib/Models/LongestEverTeamStreak';
import { getMockTeamStreak } from '../../testHelpers/getMockTeamStreak';
import { getMockTeamMemberStreak } from '../../testHelpers/getMockTeamMemberStreak';

describe('resetIncompleteTeamStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('if current streak is greater than 0 the current streak is reset and old streak is pushed to past streaks', async () => {
        expect.assertions(3);
        userModel.find = jest.fn().mockResolvedValue([]) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(true) as any;
        teamStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        teamMemberStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        const _id = '1234';
        const endDate = new Date().toString();
        const currentStreak = {
            startDate: undefined,
            numberOfDaysInARow: 1,
        };
        const userId = '5c35116059f7ba19e4e248a9';
        const member = {
            _id,
            teamMemberStreak: {
                _id,
                currentStreak,
                startDate: new Date().toString(),
                completedToday: false,
                pastStreaks: [],
                userId,
                timezone: 'Europe/London',
                createdAt: new Date().toString(),
                updatedAt: new Date().toString(),
            },
        };
        const members = [member];
        const incompleteTeamStreaks = [
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
                members,
            } as any,
        ];
        const pastStreaks = [{ numberOfDaysInARow: 1, endDate, startDate: endDate }];
        await resetIncompleteTeamStreaks(incompleteTeamStreaks as any, endDate);

        expect(teamStreakModel.findByIdAndUpdate).toBeCalledWith(_id, {
            $set: {
                pastStreaks,
            },
        });

        expect(teamStreakModel.findByIdAndUpdate).toBeCalledWith(_id, {
            $set: {
                currentStreak: { startDate: '', numberOfDaysInARow: 0 },
                active: false,
            },
        });
    });

    test('if current streak equals 0 the current streak is reset and old streak is pushed to past streaks', async () => {
        expect.assertions(2);
        userModel.find = jest.fn().mockResolvedValue([]) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(true) as any;
        teamStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        teamMemberStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        const _id = '1234';
        const endDate = new Date().toString();
        const currentStreak = {
            startDate: undefined,
            numberOfDaysInARow: 0,
        };
        const userId = '5c35116059f7ba19e4e248a9';
        const member = {
            _id,
            teamMemberStreak: {
                _id,
                currentStreak,
                startDate: new Date().toString(),
                completedToday: false,
                pastStreaks: [],
                userId,
                timezone: 'Europe/London',
                createdAt: new Date().toString(),
                updatedAt: new Date().toString(),
            },
        };
        const members = [member];
        const incompleteTeamStreaks = [
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
                members,
            } as any,
        ];

        await resetIncompleteTeamStreaks(incompleteTeamStreaks as any, endDate);

        expect(teamStreakModel.findByIdAndUpdate).toBeCalledWith(_id, {
            $set: {
                currentStreak: { startDate: '', numberOfDaysInARow: 0 },
                active: false,
            },
        });
    });

    test('if one of the members longestTeamStreaks is equal to the current team streak add an endDate to the users longestTeamStreak.', async () => {
        expect.assertions(2);

        const user = getMockUser({ _id: 'userId' });
        const teamStreak = getMockTeamStreak({ creatorId: user._id });
        const teamMemberStreak = getMockTeamMemberStreak({ teamStreak, user });
        const longestTeamStreak: LongestEverTeamStreak = {
            members: [{ memberId: user._id, teamMemberStreakId: teamMemberStreak._id }],
            numberOfDays: 0,
            startDate: new Date().toString(),
            streakType: StreakTypes.team,
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
        };
        userModel.find = jest.fn().mockResolvedValue([{ ...user, longestTeamStreak }]) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(true) as any;
        teamStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        teamMemberStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;

        const endDate = new Date().toString();

        const incompleteTeamStreaks = [teamStreak];

        await resetIncompleteTeamStreaks(incompleteTeamStreaks as any, endDate);

        expect(userModel.findByIdAndUpdate).toBeCalledWith(user._id, {
            $set: { longestTeamStreak: { ...longestTeamStreak, endDate } },
        });
    });

    test('creates a lost team streak tracking event.', async () => {
        expect.assertions(1);
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(true) as any;
        teamStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        teamMemberStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        const _id = '1234';
        const endDate = new Date().toString();
        const currentStreak = {
            startDate: undefined,
            numberOfDaysInARow: 0,
        };
        const userId = '5c35116059f7ba19e4e248a9';
        const member = {
            _id,
            teamMemberStreak: {
                _id,
                currentStreak,
                startDate: new Date().toString(),
                completedToday: false,
                pastStreaks: [],
                userId,
                timezone: 'Europe/London',
                createdAt: new Date().toString(),
                updatedAt: new Date().toString(),
            },
        };
        const members = [member];
        const incompleteTeamStreaks = [
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
                members,
            } as any,
        ];

        await resetIncompleteTeamStreaks(incompleteTeamStreaks as any, endDate);

        expect(createStreakTrackingEvent).toBeCalledWith({
            type: StreakTrackingEventTypes.lostStreak,
            streakId: _id,
            streakType: StreakTypes.team,
        });
    });
});
