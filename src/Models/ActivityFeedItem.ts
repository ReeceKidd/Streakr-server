import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { ActivityFeedItem } from '@streakoid/streakoid-sdk/lib';

export type ActivityFeedItemModel = ActivityFeedItem & mongoose.Document;

export const activitySchema = new mongoose.Schema(
    {
        activityFeedItemType: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
        },
        streakId: {
            type: String,
        },
        challengeId: {
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
