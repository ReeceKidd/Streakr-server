/* eslint-disable @typescript-eslint/no-explicit-any */
const endDate = new Date();
const endOf = jest.fn(() => ({
    toDate: jest.fn(() => endDate),
}));
jest.mock('moment-timezone', () => ({
    tz: jest.fn(() => ({
        isSame: jest.fn(() => false),
        endOf,
    })),
}));

import { adjustStreakDailyTrackerForDaylightSavingsTime } from './adjustStreakDailyTrackerForDaylightSavingsTime';
import AgendaJobNames from '@streakoid/streakoid-models/lib/Types/AgendaJobNames';
import { agendaJobModel } from '../../Models/AgendaJob';
import moment from 'moment-timezone';
import { AgendaTimeRanges } from '../agenda';

describe('adjustStreakDailyTrackerForDaylightSavingsTime', () => {
    test('finds the correct streakDailyTracker job and then updates the nextRunAt time to be the new end of day time according to daylight savings.', async () => {
        expect.assertions(4);
        const timezone = 'Europe/London';

        agendaJobModel.findOne = jest.fn().mockResolvedValue({ _id: '_id', nextRunAt: new Date() }) as any;
        agendaJobModel.findByIdAndUpdate = jest.fn().mockResolvedValue(true) as any;

        const agendaJobName = AgendaJobNames.soloStreakDailyTracker;

        await adjustStreakDailyTrackerForDaylightSavingsTime({ timezone, agendaJobName });

        expect(agendaJobModel.findOne).toBeCalledWith({ name: agendaJobName, 'data.timezone': timezone });
        expect(moment.tz).toBeCalledWith(timezone);
        expect(moment.tz().endOf).toBeCalledWith(AgendaTimeRanges.day);
        expect(agendaJobModel.findByIdAndUpdate).toBeCalledWith('_id', { $set: { nextRunAt: endDate } });
    });
});
