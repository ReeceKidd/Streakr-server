import * as mongoose from 'mongoose';
import { Models } from './Models';
import { Collections } from './Collections';

export interface CompleteTask extends mongoose.Document {
    streakId: string,
    taskCompleteTime: Date,
    taskCompleteDay: string
}

export const completeTaskSchema = new mongoose.Schema({
    streakId: {
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
}, {
        timestamps: true,
        collection: Collections.CompleteTasks,
    })

export const completeTaskModel: mongoose.Model<CompleteTask> = mongoose.model<CompleteTask>(Models.CompleteTask, completeTaskSchema)

