import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { AchievementType } from '@streakoid/streakoid-models/lib/Models/Achievement';
import AchievementTypes from '@streakoid/streakoid-models/lib/Types/AchievementTypes';

export type AchievementModel = AchievementType & mongoose.Document;

export const achievementSchema = new mongoose.Schema(
    {
        achievementType: {
            type: AchievementTypes,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        collection: Collections.Achievements,
    },
);

export const achievementModel: mongoose.Model<AchievementModel> = mongoose.model<AchievementModel>(
    Models.Achievements,
    achievementSchema,
);
