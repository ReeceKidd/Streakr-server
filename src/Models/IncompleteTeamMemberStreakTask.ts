import * as mongoose from 'mongoose';
import { Models } from './Models';
import { Collections } from './Collections';
import { IncompleteTeamMemberStreakTask, StreakTypes } from '@streakoid/streakoid-sdk/lib';

export type IncompleteTeamMemberStreakTaskModel = IncompleteTeamMemberStreakTask & mongoose.Document;

export const incompleteTeamMemberStreakTaskSchema = new mongoose.Schema(
    {
        userId: {
            required: true,
            type: String,
        },
        teamMemberStreakId: {
            required: true,
            type: String,
        },
        streakType: {
            required: true,
            type: String,
            enum: [StreakTypes.teamMember],
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
        collection: Collections.IncompleteTeamMemberStreakTasks,
    },
);

incompleteTeamMemberStreakTaskSchema.index({ userId: 1, streakId: 1 });

export const incompleteTeamMemberStreakTaskModel: mongoose.Model<IncompleteTeamMemberStreakTaskModel> = mongoose.model<
    IncompleteTeamMemberStreakTaskModel
>(Models.IncompleteTeamMemberStreakTask, incompleteTeamMemberStreakTaskSchema);
