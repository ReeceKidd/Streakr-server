import * as mongoose from "mongoose";
import { Models } from "./Models";
import { Collections } from "./Collections";


export enum TypesOfStreak {
    soloStreak = "solo-streak"
}

export interface CompleteTask extends mongoose.Document {
    streakId: string;
    userId: string;
    taskCompleteTime: Date;
    taskCompleteDay: string;
    streakType: TypesOfStreak;
}

export const completeTaskSchema = new mongoose.Schema({
    streakId: {
        required: true,
        type: String
    },
    userId: {
        required: true,
        type: String
    },
    taskCompleteTime: {
        required: true,
        type: Date
    },
    taskCompleteDay: {
        required: true,
        type: String
    },
    streakType: {
        required: true,
        type: String,
    }
}, {
        timestamps: true,
        collection: Collections.CompleteTasks,
    });

completeTaskSchema.index({ userId: 1, streakId: 1, taskCompleteDay: 1 }, { unique: true });

export const completeTaskModel: mongoose.Model<CompleteTask> = mongoose.model<CompleteTask>(Models.CompleteTask, completeTaskSchema);

