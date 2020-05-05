import * as mongoose from 'mongoose';
import { Models } from './Models';
import { Collections } from './Collections';
import { CompleteChallengeStreakTask } from '@streakoid/streakoid-models/lib/Models/CompleteChallengeStreakTask';

export type CompleteChallengeStreakTaskModel = CompleteChallengeStreakTask & mongoose.Document;

export const completeChallengeStreakTaskSchema = new mongoose.Schema(
    {
        challengeStreakId: {
            required: true,
            index: true,
            type: String,
        },
        userId: {
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
        collection: Collections.CompleteChallengeStreakTasks,
    },
);

export const completeChallengeStreakTaskModel: mongoose.Model<CompleteChallengeStreakTaskModel> = mongoose.model<
    CompleteChallengeStreakTaskModel
>(Models.CompleteChallengeStreakTask, completeChallengeStreakTaskSchema);
