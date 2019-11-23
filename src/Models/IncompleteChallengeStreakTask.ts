import * as mongoose from 'mongoose';
import { Models } from './Models';
import { Collections } from './Collections';
import { IncompleteChallengeStreakTask } from '@streakoid/streakoid-sdk/lib';

export type IncompleteChallengeStreakTaskModel = IncompleteChallengeStreakTask & mongoose.Document;

export const incompleteChallengeStreakTaskSchema = new mongoose.Schema(
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
        collection: Collections.IncompleteChallengeStreakTasks,
    },
);

export const incompleteChallengeStreakTaskModel: mongoose.Model<IncompleteChallengeStreakTaskModel> = mongoose.model<
    IncompleteChallengeStreakTaskModel
>(Models.IncompleteChallengeStreakTask, incompleteChallengeStreakTaskSchema);
