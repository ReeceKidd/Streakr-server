import * as mongoose from 'mongoose';
import { Models } from './Models';
import { Collections } from './Collections';
import { IncompleteGroupMemberStreakTask } from '@streakoid/streakoid-sdk/lib';

export type IncompleteGroupMemberStreakTaskModel = IncompleteGroupMemberStreakTask & mongoose.Document;

export const incompleteGroupMemberStreakTaskSchema = new mongoose.Schema(
    {
        userId: {
            required: true,
            type: String,
        },
        groupMemberStreakId: {
            required: true,
            type: String,
        },
        groupStreakType: {
            required: true,
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
        teamStreakId: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: Collections.IncompleteGroupMemberStreakTasks,
    },
);

incompleteGroupMemberStreakTaskSchema.index({ userId: 1, streakId: 1 });

export const incompleteGroupMemberStreakTaskModel: mongoose.Model<
    IncompleteGroupMemberStreakTaskModel
> = mongoose.model<IncompleteGroupMemberStreakTaskModel>(
    Models.IncompleteGroupMemberStreakTask,
    incompleteGroupMemberStreakTaskSchema,
);
