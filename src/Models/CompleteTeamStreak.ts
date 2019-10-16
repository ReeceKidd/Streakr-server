import * as mongoose from 'mongoose';
import { Models } from './Models';
import { Collections } from './Collections';
import { CompleteTeamStreak } from '@streakoid/streakoid-sdk/lib';

export type CompleteTeamStreakModel = CompleteTeamStreak & mongoose.Document;

export const completeTeamStreakSchema = new mongoose.Schema(
    {
        teamStreakId: {
            required: true,
            index: true,
            type: String,
        },
        taskCompleteTime: {
            required: true,
            type: Date,
        },
        taskCompleteDay: {
            required: true,
            type: String,
        },
    },
    {
        timestamps: true,
        collection: Collections.CompleteTeamStreaks,
    },
);

completeTeamStreakSchema.index({ userId: 1, streakId: 1 });

export const completeTeamStreakModel: mongoose.Model<CompleteTeamStreakModel> = mongoose.model<CompleteTeamStreakModel>(
    Models.CompleteTeamStreak,
    completeTeamStreakSchema,
);
