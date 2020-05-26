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
jest.mock('./trackMaintainedChallengeStreaks', () => ({
    __esModule: true,
    trackMaintainedChallengeStreaks: jest.fn().mockResolvedValue(true),
}));
jest.mock('./trackInactiveChallengeStreaks', () => ({
    __esModule: true,
    trackInactiveChallengeStreaks: jest.fn().mockResolvedValue(true),
}));
jest.mock('./resetIncompleteChallengeStreaks', () => ({
    __esModule: true,
    resetIncompleteChallengeStreaks: jest.fn().mockResolvedValue(true),
}));
jest.mock('../../helpers/createDailyJob', () => ({
    __esModule: true,
    createDailyJob: jest.fn().mockResolvedValue(true),
}));

import { resetIncompleteChallengeStreaks } from './resetIncompleteChallengeStreaks';
import { manageDailyChallengeStreaks } from './manageDailyChallengeStreaks';
import { trackMaintainedChallengeStreaks } from './trackMaintainedChallengeStreaks';
import { trackInactiveChallengeStreaks } from './trackInactiveChallengeStreaks';
import { challengeStreakModel } from '../../../src/Models/ChallengeStreak';
import { createDailyJob } from '../../helpers/createDailyJob';

describe('manageDailyChallengeStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('calls trackMaintainedChallengeStreaks, trackInactiveChallengeStreaks, resetIncompleteChallengeStreaks and creates DailyJob', async () => {
        expect.assertions(7);
        challengeStreakModel.find = jest.fn().mockResolvedValue([]) as any;
        const agendaJobId = 'agendaJobId';
        const timezone = 'Europe/London';
        await manageDailyChallengeStreaks({ agendaJobId, timezone });

        expect(challengeStreakModel.find).toBeCalledWith({
            completedToday: true,
            active: true,
            timezone,
        });
        expect(trackMaintainedChallengeStreaks).toBeCalledWith(expect.any(Array));

        expect(challengeStreakModel.find).toBeCalledWith({
            completedToday: false,
            active: false,
            timezone,
        });
        expect(trackInactiveChallengeStreaks).toBeCalledWith(expect.any(Array));

        expect(challengeStreakModel.find).toBeCalledWith({
            completedToday: false,
            active: true,
            timezone,
        });
        expect(resetIncompleteChallengeStreaks).toBeCalledWith(expect.any(Array), expect.any(String));

        expect(createDailyJob).toBeCalled();
    });
});
