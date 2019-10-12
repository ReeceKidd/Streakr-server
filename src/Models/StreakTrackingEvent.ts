import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { StreakTrackingEvent, StreakTypes } from '@streakoid/streakoid-sdk/lib';

export type StreakTrackingEventModel = StreakTrackingEvent & mongoose.Document;

export const streakTrackingActivitySchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
        },
        streakId: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        streakType: {
            type: StreakTypes,
            required: true,
        },
    },
    {
        timestamps: true,
        collection: Collections.StreakTrackingEvents,
    },
);

export const streakTrackingEventModel: mongoose.Model<StreakTrackingEventModel> = mongoose.model<
    StreakTrackingEventModel
>(Models.StreakTrackingEvent, streakTrackingActivitySchema);
