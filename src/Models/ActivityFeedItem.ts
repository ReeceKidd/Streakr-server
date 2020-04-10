import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { ActivityFeedItemTypes } from '@streakoid/streakoid-sdk/lib';

export type ActivityFeedItemModel = mongoose.Document;

export const activityFeedItemSchema = new mongoose.Schema(
    {
        activityFeedItemType: {
            type: ActivityFeedItemTypes,
            required: true,
        },
        userId: {
            type: String,
        },
        username: {
            type: String,
        },
        soloStreakId: {
            type: String,
        },
        soloStreakName: {
            type: String,
        },
        challengeStreakId: {
            type: String,
        },
        challengeId: {
            type: String,
        },
        challengeName: {
            type: String,
        },
        teamStreakId: {
            type: String,
        },
        teamStreakName: {
            type: String,
        },
        userFollowedId: {
            type: String,
        },
        userFollowedUsername: {
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
