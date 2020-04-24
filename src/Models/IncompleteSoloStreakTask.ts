import * as mongoose from 'mongoose';
import { Models } from './Models';
import { Collections } from './Collections';
import { IncompleteSoloStreakTask } from '@streakoid/streakoid-models/lib';

export type IncompleteSoloStreakTaskModel = IncompleteSoloStreakTask & mongoose.Document;

export const incompleteSoloStreakTaskSchema = new mongoose.Schema(
    {
        streakId: {
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
        collection: Collections.IncompleteSoloStreakTasks,
    },
);

export const incompleteSoloStreakTaskModel: mongoose.Model<IncompleteSoloStreakTaskModel> = mongoose.model<
    IncompleteSoloStreakTaskModel
>(Models.IncompleteSoloStreakTask, incompleteSoloStreakTaskSchema);
