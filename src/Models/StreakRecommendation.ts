import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { StreakRecommendation } from '@streakoid/streakoid-sdk/lib';

export type StreakRecommendationModel = StreakRecommendation & mongoose.Document;

export const streakRecommendationSchema = new mongoose.Schema(
    {
        streakName: {
            required: true,
            type: String,
            index: true,
        },
        streakDescription: {
            type: String,
            default: '',
        },
        numberOfMinutes: {
            type: Number,
        },
    },
    {
        timestamps: true,
        collection: Collections.StreakRecommendations,
    },
);

export const streakRecommendationModel: mongoose.Model<StreakRecommendationModel> = mongoose.model<
    StreakRecommendationModel
>(Models.StreakRecommendation, streakRecommendationSchema);
