jest.mock('moment-timezone', () => ({
    tz: jest.fn(() => ({
        toDate: jest.fn(() => new Date()),
    })),
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

import { resetIncompleteSoloStreaks } from './resetIncompleteSoloStreaks';
import { manageDailySoloStreaks } from './manageDailySoloStreaks';
import { trackMaintainedSoloStreaks } from './trackMaintainedSoloStreaks';
import { trackInactiveSoloStreaks } from './trackInactiveSoloStreaks';
import streakoid from '../../streakoid';

describe('manageDailySoloStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('calls trackMaintainedSoloStreaks, trackInactiveSoloStreaks, resetIncompleteSoloStreaks and creates DailyJob', async () => {
        expect.assertions(7);
        streakoid.dailyJobs.create = jest.fn(() => ({}));
        streakoid.soloStreaks.getAll = jest.fn(() => {
            return [];
        });
        const agendaJobId = 'agendaJobId';
        const timezone = 'Europe/London';
        await manageDailySoloStreaks({ agendaJobId, timezone });

        expect(streakoid.soloStreaks.getAll).toBeCalledWith({
            completedToday: true,
            active: true,
            timezone,
        });
        expect(trackMaintainedSoloStreaks).toBeCalledWith(expect.any(Array));

        expect(streakoid.soloStreaks.getAll).toBeCalledWith({
            completedToday: false,
            active: false,
            timezone,
        });
        expect(trackInactiveSoloStreaks).toBeCalledWith(expect.any(Array));

        expect(streakoid.soloStreaks.getAll).toBeCalledWith({
            completedToday: false,
            active: true,
            timezone,
        });
        expect(resetIncompleteSoloStreaks).toBeCalledWith(expect.any(Array), expect.any(String));

        expect(streakoid.dailyJobs.create).toBeCalled();
    });
});
