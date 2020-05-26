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
jest.mock('./trackMaintainedSoloStreaks', () => ({
    __esModule: true,
    trackMaintainedSoloStreaks: jest.fn().mockResolvedValue(true),
}));
jest.mock('./trackInactiveSoloStreaks', () => ({
    __esModule: true,
    trackInactiveSoloStreaks: jest.fn().mockResolvedValue(true),
}));
jest.mock('./resetIncompleteSoloStreaks', () => ({
    __esModule: true,
    resetIncompleteSoloStreaks: jest.fn().mockResolvedValue(true),
}));
jest.mock('../../helpers/createDailyJob', () => ({
    __esModule: true,
    createDailyJob: jest.fn().mockResolvedValue(true),
}));

import { resetIncompleteSoloStreaks } from './resetIncompleteSoloStreaks';
import { manageDailySoloStreaks } from './manageDailySoloStreaks';
import { trackMaintainedSoloStreaks } from './trackMaintainedSoloStreaks';
import { trackInactiveSoloStreaks } from './trackInactiveSoloStreaks';
import { soloStreakModel } from '../../../src/Models/SoloStreak';
import { createDailyJob } from '../../helpers/createDailyJob';

describe('manageDailySoloStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('calls trackMaintainedSoloStreaks, trackInactiveSoloStreaks, resetIncompleteSoloStreaks and creates DailyJob', async () => {
        expect.assertions(7);
        soloStreakModel.find = jest.fn().mockResolvedValue([]) as any;
        const agendaJobId = 'agendaJobId';
        const timezone = 'Europe/London';
        await manageDailySoloStreaks({ agendaJobId, timezone });

        expect(soloStreakModel.find).toBeCalledWith({
            completedToday: true,
            active: true,
            timezone,
        });
        expect(trackMaintainedSoloStreaks).toBeCalledWith(expect.any(Array));

        expect(soloStreakModel.find).toBeCalledWith({
            completedToday: false,
            active: false,
            timezone,
        });
        expect(trackInactiveSoloStreaks).toBeCalledWith(expect.any(Array));

        expect(soloStreakModel.find).toBeCalledWith({
            completedToday: false,
            active: true,
            timezone,
        });
        expect(resetIncompleteSoloStreaks).toBeCalledWith(expect.any(Array), expect.any(String));

        expect(createDailyJob).toBeCalled();
    });
});
