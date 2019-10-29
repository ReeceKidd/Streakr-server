import * as mongoose from 'mongoose';
import { Models } from './Models';
import { Collections } from './Collections';
import { IncompleteTeamStreak } from '@streakoid/streakoid-sdk/lib';

export type IncompleteTeamStreakModel = IncompleteTeamStreak & mongoose.Document;

export const incompleteTeamStreakSchema = new mongoose.Schema(
    {
        teamStreakId: {
            required: true,
            index: true,
            type: String,
        },
        userId: {
            required: true,
            index: true,
            type: String,
        },
        taskIncompleteTime: {
            required: true,
            type: Date,
        },
        taskIncompleteDay: {
            required: true,
            type: String,
        },
    },
    {
        timestamps: true,
        collection: Collections.IncompleteTeamStreaks,
    },
);

export const incompleteTeamStreakModel: mongoose.Model<IncompleteTeamStreakModel> = mongoose.model<
    IncompleteTeamStreakModel
>(Models.IncompleteTeamStreak, incompleteTeamStreakSchema);
