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
        numberOfDaysInARow: number
    };
    pastStreaks: [];
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
        default: new Date(),
    },
    completedToday: {
        type: Boolean,
        default: false
    },
    currentStreak: {
        startDate: {
            type: String,
            default: undefined
        },
        numberOfDaysInARow: {
            type: Number,
            default: 0
        }
    },
    pastStreaks: [],
}, {
        timestamps: true,
        collection: Collections.SoloStreaks,
    },
);

export const soloStreakModel: mongoose.Model<SoloStreak> = mongoose.model<SoloStreak>(Models.SoloStreak, soloStreakSchema);
