import * as mongoose from 'mongoose';
import { Models } from './Models';
import { Collections } from './Collections';
import { CompleteTeamMemberStreakTask } from '@streakoid/streakoid-sdk/lib';

export type CompleteTeamMemberStreakTaskModel = CompleteTeamMemberStreakTask & mongoose.Document;

export const completeTeamMemberStreakTaskSchema = new mongoose.Schema(
    {
        userId: {
            required: true,
            type: String,
        },
        teamMemberStreakId: {
            required: true,
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
        teamStreakId: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: Collections.CompleteTeamMemberStreakTasks,
    },
);

completeTeamMemberStreakTaskSchema.index({ userId: 1, streakId: 1 });

export const completeTeamMemberStreakTaskModel: mongoose.Model<CompleteTeamMemberStreakTaskModel> = mongoose.model<
    CompleteTeamMemberStreakTaskModel
>(Models.CompleteTeamMemberStreakTask, completeTeamMemberStreakTaskSchema);
