import * as mongoose from 'mongoose';
import { Models } from './Models';
import { Collections } from './Collections';
import { CompleteTeamStreakTask } from '@streakoid/streakoid-sdk/lib';

export type CompleteTeamStreakTaskModel = CompleteTeamStreakTask & mongoose.Document;

export const completeTeamStreakTaskSchema = new mongoose.Schema(
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
        collection: Collections.CompleteTeamStreakTasks,
    },
);

completeTeamStreakTaskSchema.index({ userId: 1, streakId: 1 });

export const completeTeamStreakTaskModel: mongoose.Model<CompleteTeamStreakTaskModel> = mongoose.model<
    CompleteTeamStreakTaskModel
>(Models.CompleteTeamStreakTask, completeTeamStreakTaskSchema);
