import * as mongoose from 'mongoose';
import { IUser } from './User';

export interface ISoloStreak extends mongoose.Document {
    user: IUser;
    streakName: string;
    streakDescription: string;
    startDate: Date;
    calendar?: object[];
}

export const soloStreakSchema = new mongoose.Schema({
    user: {
        required: true,
        type: Object
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
        collection: 'SoloStreaks',
    },
);

export const soloStreakModel: mongoose.Model<ISoloStreak> = mongoose.model<ISoloStreak>('SoloStreak', soloStreakSchema);
