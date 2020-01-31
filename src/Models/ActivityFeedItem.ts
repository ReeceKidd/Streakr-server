import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { ActivityFeedItem } from '@streakoid/streakoid-sdk/lib';

export type ActivityFeedItemModel = ActivityFeedItem & mongoose.Document;

export const activityFeedItemSchema = new mongoose.Schema(
    {
        activityFeedItemType: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
        },
        subjectId: {
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
    activityFeedItemSchema,
);
