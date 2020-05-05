import * as mongoose from 'mongoose';
import { Models } from './Models';
import { Collections } from './Collections';
import { IncompleteTeamMemberStreakTask } from '@streakoid/streakoid-models/lib/Models/IncompleteTeamMemberStreakTask';

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

export const incompleteTeamMemberStreakTaskModel: mongoose.Model<IncompleteTeamMemberStreakTaskModel> = mongoose.model<
    IncompleteTeamMemberStreakTaskModel
>(Models.IncompleteTeamMemberStreakTask, incompleteTeamMemberStreakTaskSchema);
