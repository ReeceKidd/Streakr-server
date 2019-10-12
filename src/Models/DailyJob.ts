import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { DailyJob, StreakTypes, AgendaJobNames } from '@streakoid/streakoid-sdk/lib';

export type DailyJobModel = DailyJob & mongoose.Document;

export const dailyJobSchema = new mongoose.Schema(
    {
        jobName: {
            type: AgendaJobNames,
            required: true,
        },
        timezone: {
            type: String,
            required: true,
        },
        localisedJobCompleteTime: {
            type: String,
            required: true,
        },
        streakType: {
            type: StreakTypes,
            required: true,
        },
        wasSuccessful: {
            type: Boolean,
            required: true,
        },
    },
    {
        timestamps: true,
        collection: Collections.DailyJobs,
    },
);

export const dailyJobModel: mongoose.Model<DailyJobModel> = mongoose.model<DailyJobModel>(
    Models.DailyJob,
    dailyJobSchema,
);
