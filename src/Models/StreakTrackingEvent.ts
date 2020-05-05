import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { StreakTrackingEvent } from '@streakoid/streakoid-models/lib/Models/StreakTrackingEvent';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

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
