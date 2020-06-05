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

import { adjustForDaylightSavingsTime } from './adjustForDaylightSavingsTime';
import AgendaJobNames from '@streakoid/streakoid-models/lib/Types/AgendaJobNames';
import { agendaJobModel } from '../../Models/AgendaJob';
import moment from 'moment-timezone';
import { AgendaTimeRanges } from '../agenda';

describe('adjustForDaylightSavingsTime', () => {
    test('finds the correct streakDailyTracker job and then updates the nextRunAt time to be the new end of day time according to daylight savings.', async () => {
        expect.assertions(7);
        const timezone = 'Europe/London';

        agendaJobModel.findOne = jest.fn().mockResolvedValue({ _id: '_id', nextRunAt: new Date() }) as any;
        agendaJobModel.findByIdAndUpdate = jest.fn().mockResolvedValue(true) as any;

        await adjustForDaylightSavingsTime({ timezone });

        expect(agendaJobModel.findOne).toBeCalledWith({
            name: AgendaJobNames.soloStreakDailyTracker,
            'data.timezone': timezone,
        });
        expect(agendaJobModel.findOne).toBeCalledWith({
            name: AgendaJobNames.teamStreakDailyTracker,
            'data.timezone': timezone,
        });
        expect(agendaJobModel.findOne).toBeCalledWith({
            name: AgendaJobNames.challengeStreakDailyTracker,
            'data.timezone': timezone,
        });
        expect(moment.tz).toBeCalledWith(timezone);
        expect(moment.tz().endOf).toBeCalledWith(AgendaTimeRanges.day);
        expect(agendaJobModel.findByIdAndUpdate).toBeCalledTimes(3);
        expect(agendaJobModel.findByIdAndUpdate).toBeCalledWith('_id', { $set: { nextRunAt: endDate } });
    });
});
