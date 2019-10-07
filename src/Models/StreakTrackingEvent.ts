import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { StreakTrackingEvent } from '@streakoid/streakoid-sdk/lib';

export type StreakTrackingEventModel = StreakTrackingEvent & mongoose.Document;

export const streakTrackingActivitySchema = new mongoose.Schema(
    {
        type: String,
        streakId: String,
        userId: String,
    },
    {
        timestamps: true,
        collection: Collections.StreakTrackingEvents,
    },
);

export const streakTrackingEventModel: mongoose.Model<StreakTrackingEventModel> = mongoose.model<
    StreakTrackingEventModel
>(Models.StreakTrackingEvent, streakTrackingActivitySchema);
