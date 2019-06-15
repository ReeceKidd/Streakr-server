import * as mongoose from "mongoose";
import { Collections } from "./Collections";
import { Models } from "./Models";

export interface SoloStreak extends mongoose.Document {
    userId: string;
    streakName: string;
    streakDescription: string;
    startDate: Date;
    completedToday: boolean;
    currentStreak: {
        startDate: Date,
        numberOfDaysInARow: number,
        endDate: Date
    };
    pastStreaks: Array<{
        endDate: Date,
        startDate: Date,
        numberOfDaysInARow: number
    }>;
    timezone: string;
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
    timezone: {
        required: true,
        type: String
    },
    startDate: {
        type: Date,
        default: undefined,
    },
    completedToday: {
        type: Boolean,
        default: false
    },
    currentStreak: {
        startDate: {
            type: Date,
            default: undefined
        },
        numberOfDaysInARow: {
            type: Number,
            default: 0
        },
        endDate: {
            type: Date,
            default: undefined
        }
    },
    pastStreaks: [],
}, {
        timestamps: true,
        collection: Collections.SoloStreaks,
    },
);

export const soloStreakModel: mongoose.Model<SoloStreak> = mongoose.model<SoloStreak>(Models.SoloStreak, soloStreakSchema);
