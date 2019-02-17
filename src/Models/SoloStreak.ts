import * as mongoose from 'mongoose';

export interface ISoloStreak extends mongoose.Document {
    streakName: string;
    description: string;
    startDate: Date;
    calendar?: object[];
}

export const soloStreakSchema = new mongoose.Schema({
    streakName: {
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
        collection: 'SoloStreaks',
    },
);

export const soloStreakModel: mongoose.Model<ISoloStreak> = mongoose.model<ISoloStreak>('SoloStreak', soloStreakSchema);
