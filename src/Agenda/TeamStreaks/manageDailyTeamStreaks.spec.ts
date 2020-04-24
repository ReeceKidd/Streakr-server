/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('moment-timezone', () => ({
    tz: jest.fn(() => ({
        toDate: jest.fn(() => new Date()),
    })),
}));
jest.mock('mongoose', () => ({
    connect: jest.fn().mockResolvedValue({}),
    Schema: jest.fn(),
    model: jest.fn(() => ({})),
    connection: {
        close: jest.fn(),
    },
}));
jest.mock('./trackMaintainedTeamMemberStreaks', () => ({
    __esModule: true,
    trackMaintainedTeamMemberStreaks: jest.fn().mockResolvedValue(true),
}));
jest.mock('./trackInactiveTeamMemberStreaks', () => ({
    __esModule: true,
    trackInactiveTeamMemberStreaks: jest.fn().mockResolvedValue(true),
}));
jest.mock('./resetIncompleteTeamMemberStreaks', () => ({
    __esModule: true,
    resetIncompleteTeamMemberStreaks: jest.fn().mockResolvedValue(true),
}));
jest.mock('./trackMaintainedTeamStreaks', () => ({
    __esModule: true,
    trackMaintainedTeamStreaks: jest.fn().mockResolvedValue(true),
}));
jest.mock('./trackInactiveTeamStreaks', () => ({
    __esModule: true,
    trackInactiveTeamStreaks: jest.fn().mockResolvedValue(true),
}));
jest.mock('./resetIncompleteTeamStreaks', () => ({
    __esModule: true,
    resetIncompleteTeamStreaks: jest.fn().mockResolvedValue(true),
}));

import { manageDailyTeamStreaks } from './manageDailyTeamStreaks';
import { resetIncompleteTeamMemberStreaks } from './resetIncompleteTeamMemberStreaks';
import { trackMaintainedTeamMemberStreaks } from './trackMaintainedTeamMemberStreaks';
import { trackInactiveTeamMemberStreaks } from './trackInactiveTeamMemberStreaks';
import { resetIncompleteTeamStreaks } from './resetIncompleteTeamStreaks';
import { trackMaintainedTeamStreaks } from './trackMaintainedTeamStreaks';
import { trackInactiveTeamStreaks } from './trackInactiveTeamStreaks';
import streakoid from '../../streakoid';
import { teamMemberStreakModel } from '../../../src/Models/TeamMemberStreak';

describe('manageDailyStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('calls trackMaintainedTeamMemberStreaks, trackInactiveTeamMemberStreaks, resetIncompleteTeamMemberStreaks, trackMaintainedTeamStreaks, trackInactiveTeamStreaks, resetIncompleteTeamStreaks and creates a team streak DailyJob', async () => {
        expect.assertions(13);
        streakoid.dailyJobs.create = jest.fn(() => ({})) as any;
        teamMemberStreakModel.find = jest.fn(() => {
            return [];
        }) as any;
        streakoid.teamStreaks.getAll = jest.fn(() => {
            return [];
        }) as any;
        const agendaJobId = 'agendaJobId';
        const timezone = 'Europe/London';
        await manageDailyTeamStreaks({ agendaJobId, timezone });

        expect(teamMemberStreakModel.find).toBeCalledWith({
            completedToday: true,
            active: true,
            timezone,
        });

        // Import new SDK and make changes.

        expect(teamMemberStreakModel.find).toBeCalledWith({
            completedToday: false,
            active: false,
            timezone,
        });

        expect(teamMemberStreakModel.find).toBeCalledWith({
            completedToday: false,
            active: true,
            timezone,
        });
        expect(trackMaintainedTeamMemberStreaks).toBeCalledWith(expect.any(Array));
        expect(trackInactiveTeamMemberStreaks).toBeCalledWith(expect.any(Array));
        expect(resetIncompleteTeamMemberStreaks).toBeCalledWith(expect.any(Array), expect.any(String));

        expect(streakoid.teamStreaks.getAll).toBeCalledWith({
            completedToday: true,
            active: true,
            timezone,
        });

        expect(streakoid.teamStreaks.getAll).toBeCalledWith({
            completedToday: false,
            active: false,
            timezone,
        });

        expect(streakoid.teamStreaks.getAll).toBeCalledWith({
            completedToday: false,
            active: true,
            timezone,
        });
        expect(trackMaintainedTeamStreaks).toBeCalledWith(expect.any(Array));
        expect(trackInactiveTeamStreaks).toBeCalledWith(expect.any(Array));
        expect(resetIncompleteTeamStreaks).toBeCalledWith(expect.any(Array), expect.any(String));

        expect(streakoid.dailyJobs.create).toBeCalled();
    });
});
