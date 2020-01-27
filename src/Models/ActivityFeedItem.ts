import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { ActivityFeedItem } from '@streakoid/streakoid-sdk/lib';

export type ActivityFeedItemModel = ActivityFeedItem & mongoose.Document;

export const activitySchema = new mongoose.Schema(
    {
        activityType: {
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
        collection: Collections.ActivityFeedItems,
    },
);

export const activityFeedItemModel: mongoose.Model<ActivityFeedItemModel> = mongoose.model<ActivityFeedItemModel>(
    Models.ActivityFeedItem,
    activitySchema,
);
