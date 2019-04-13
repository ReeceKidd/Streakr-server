import * as mongoose from 'mongoose';
import { IUser } from './User';
import { Collections } from './Collections';
import { Models } from './Models';

export interface ISoloStreak extends mongoose.Document {
    user: IUser;
    streakName: string;
    streakDescription: string;
    startDate: Date;
    calendar?: object[];
}

export const soloStreakSchema = new mongoose.Schema({
    userId: {
        required: true,
        type: String,
        index: true
    },
    streakName: {
        required: true,
        type: String,
        index: true,
    },
    streakDescription: {
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
