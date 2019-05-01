import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';

export interface ITaskComplete {
    date: Date
}

export interface ISoloStreak extends mongoose.Document {
    userId: string;
    streakName: string;
    streakDescription: string;
    startDate: Date;
    calendar?: ITaskComplete[];
}

export const soloStreakSchema = new mongoose.Schema({
    userId: {
        required: true,
        type: String,
        index: true
    },
    name: {
        required: true,
        type: String,
        index: true,
    },
    description: {
        required: true,
        type: String,
    },
    startDate: {
        type: Date,
        default: new Date(),
    },
    calendar: {
        type: Array,
        default: [],
    },
}, {
        timestamps: true,
        collection: Collections.SoloStreaks,
    },
);

export const soloStreakModel: mongoose.Model<ISoloStreak> = mongoose.model<ISoloStreak>(Models.SoloStreak, soloStreakSchema);
