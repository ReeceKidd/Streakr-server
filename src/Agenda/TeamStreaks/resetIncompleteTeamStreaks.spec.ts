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

describe('resetIncompleteTeamStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('if current streak is greater than 0 the current streak is reset and old streak is pushed to past streaks, lost streak activity is recorded', async () => {
        expect.assertions(3);
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

        expect(createStreakTrackingEvent).toBeCalledWith({
            type: StreakTrackingEventTypes.lostStreak,
            streakId: _id,
            streakType: StreakTypes.team,
        });
    });

    test('if current streak equals 0 the current streak is reset and old streak is pushed to past streaks, lost streak activity is recorded', async () => {
        expect.assertions(2);
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

        expect(createStreakTrackingEvent).toBeCalledWith({
            type: StreakTrackingEventTypes.lostStreak,
            streakId: _id,
            streakType: StreakTypes.team,
        });
    });
});
