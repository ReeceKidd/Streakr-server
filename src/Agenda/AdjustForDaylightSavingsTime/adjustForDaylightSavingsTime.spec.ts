/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('moment', () => ({
    tz: jest.fn(() => ({
        endOf: jest.fn(() => new Date()),
    })),
}));

jest.mock('./adjustStreakDailyTrackerForDaylightSavingsTime', () => ({
    __esModule: true,
    adjustStreakDailyTrackerForDaylightSavingsTime: jest.fn().mockResolvedValue(true),
}));

import { adjustForDaylightSavingsTime } from './adjustForDaylightSavingsTime';
import { adjustStreakDailyTrackerForDaylightSavingsTime } from './adjustStreakDailyTrackerForDaylightSavingsTime';
import AgendaJobNames from '@streakoid/streakoid-models/lib/Types/AgendaJobNames';

describe('adjustForDaylightSavingsTime', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('adjusts the timezone for soloStreakDailyTracker, teamStreakDailyTracker and challengeStreakDailyTracker to match daylight savings time', async () => {
        expect.assertions(3);
        const timezone = 'Europe/London';

        await adjustForDaylightSavingsTime({ timezone });

        expect(adjustStreakDailyTrackerForDaylightSavingsTime).toBeCalledWith({
            timezone,
            agendaJobName: AgendaJobNames.soloStreakDailyTracker,
        });
        expect(adjustStreakDailyTrackerForDaylightSavingsTime).toBeCalledWith({
            timezone,
            agendaJobName: AgendaJobNames.teamStreakDailyTracker,
        });
        expect(adjustStreakDailyTrackerForDaylightSavingsTime).toBeCalledWith({
            timezone,
            agendaJobName: AgendaJobNames.challengeStreakDailyTracker,
        });
    });
});
