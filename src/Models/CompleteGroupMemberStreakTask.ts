import * as mongoose from 'mongoose';
import { Models } from './Models';
import { Collections } from './Collections';
import { CompleteGroupMemberStreakTask, StreakTypes } from '@streakoid/streakoid-sdk/lib';

export type CompleteGroupMemberStreakTaskModel = CompleteGroupMemberStreakTask & mongoose.Document;

export const completeGroupMemberStreakTaskSchema = new mongoose.Schema(
    {
        userId: {
            required: true,
            type: String,
        },
        groupMemberStreakId: {
            required: true,
            type: String,
        },
        streakType: {
            required: true,
            type: String,
            enum: [StreakTypes.teamMember],
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
        collection: Collections.CompleteGroupMemberStreakTasks,
    },
);

completeGroupMemberStreakTaskSchema.index({ userId: 1, streakId: 1 });

export const completeGroupMemberStreakTaskModel: mongoose.Model<CompleteGroupMemberStreakTaskModel> = mongoose.model<
    CompleteGroupMemberStreakTaskModel
>(Models.CompleteGroupMemberStreakTask, completeGroupMemberStreakTaskSchema);
