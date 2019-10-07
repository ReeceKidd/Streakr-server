import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { Feedback } from '@streakoid/streakoid-sdk/lib';

export type FeedbackModel = Feedback & mongoose.Document;

export const feedbackSchema = new mongoose.Schema(
    {
        userId: {
            required: true,
            type: String,
        },
        pageUrl: {
            required: true,
            type: String,
        },
        username: {
            required: true,
            type: String,
        },
        userEmail: {
            required: true,
            type: String,
        },
        feedbackText: {
            required: true,
            type: String,
        },
    },
    {
        timestamps: true,
        collection: Collections.Feedback,
    },
);

export const feedbackModel: mongoose.Model<FeedbackModel> = mongoose.model<FeedbackModel>(
    Models.Feedback,
    feedbackSchema,
);
