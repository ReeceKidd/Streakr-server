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
jest.mock('../../helpers/createDailyJob', () => ({
    __esModule: true,
    createDailyJob: jest.fn().mockResolvedValue(true),
}));

import { manageDailyTeamStreaks } from './manageDailyTeamStreaks';
import { resetIncompleteTeamMemberStreaks } from './resetIncompleteTeamMemberStreaks';
import { trackMaintainedTeamMemberStreaks } from './trackMaintainedTeamMemberStreaks';
import { trackInactiveTeamMemberStreaks } from './trackInactiveTeamMemberStreaks';
import { resetIncompleteTeamStreaks } from './resetIncompleteTeamStreaks';
import { trackMaintainedTeamStreaks } from './trackMaintainedTeamStreaks';
import { trackInactiveTeamStreaks } from './trackInactiveTeamStreaks';
import { teamMemberStreakModel } from '../../../src/Models/TeamMemberStreak';
import { teamStreakModel } from '../../Models/TeamStreak';
import { createDailyJob } from '../../helpers/createDailyJob';

describe('manageDailyStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('calls trackMaintainedTeamMemberStreaks, trackInactiveTeamMemberStreaks, resetIncompleteTeamMemberStreaks, trackMaintainedTeamStreaks, trackInactiveTeamStreaks, resetIncompleteTeamStreaks and creates a team streak DailyJob', async () => {
        expect.assertions(13);
        teamMemberStreakModel.find = jest.fn(() => []) as any;
        teamStreakModel.find = jest.fn(() => []) as any;

        const agendaJobId = 'agendaJobId';
        const timezone = 'Europe/London';
        await manageDailyTeamStreaks({ agendaJobId, timezone });

        expect(teamMemberStreakModel.find).toBeCalledWith({
            completedToday: true,
            active: true,
            timezone,
        });

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

        expect(teamStreakModel.find).toBeCalledWith({
            completedToday: true,
            active: true,
            timezone,
        });

        expect(teamStreakModel.find).toBeCalledWith({
            completedToday: false,
            active: false,
            timezone,
        });

        expect(teamStreakModel.find).toBeCalledWith({
            completedToday: false,
            active: true,
            timezone,
        });
        expect(trackMaintainedTeamStreaks).toBeCalledWith(expect.any(Array));
        expect(trackInactiveTeamStreaks).toBeCalledWith(expect.any(Array));
        expect(resetIncompleteTeamStreaks).toBeCalledWith(expect.any(Array), expect.any(String));

        expect(createDailyJob).toBeCalled();
    });
});
