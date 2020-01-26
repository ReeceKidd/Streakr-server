import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { Activity } from '@streakoid/streakoid-sdk/lib';

export type ActivityModel = Activity & mongoose.Document;

export const activitySchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        streakId: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: Collections.Activities,
    },
);

export const activityModel: mongoose.Model<ActivityModel> = mongoose.model<ActivityModel>(
    Models.Activity,
    activitySchema,
);
