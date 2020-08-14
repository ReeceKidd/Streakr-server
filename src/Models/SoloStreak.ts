import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { SoloStreak } from '@streakoid/streakoid-models/lib/Models/SoloStreak';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

export type SoloStreakModel = SoloStreak & mongoose.Document;

export const soloStreakSchema = new mongoose.Schema(
    {
        userId: {
            required: true,
            type: String,
            index: true,
        },
        streakName: {
            required: true,
            type: String,
            index: true,
        },
        status: {
            type: String,
            default: StreakStatus.live,
        },
        streakDescription: {
            type: String,
            default: '',
        },
        numberOfMinutes: {
            type: Number,
        },
        timezone: {
            required: true,
            type: String,
        },
        completedToday: {
            type: Boolean,
            default: false,
        },
        active: {
            type: Boolean,
            default: false,
        },
        currentStreak: {
            startDate: {
                type: Date,
                default: undefined,
            },
            numberOfDaysInARow: {
                type: Number,
                default: 0,
            },
            endDate: {
                type: Date,
                default: undefined,
            },
        },
        pastStreaks: {
            type: Array,
            default: [],
        },
        userDefinedIndex: {
            type: Number,
        },
        totalTimesTracked: {
            type: Number,
            default: 0,
        },
        longestSoloStreak: {
            soloStreakId: {
                type: String,
                default: null,
            },
            soloStreakName: {
                type: String,
                default: null,
            },
            numberOfDays: {
                type: Number,
                default: 0,
            },
            streakType: {
                type: String,
                default: StreakTypes.solo,
            },
            startDate: {
                type: Date,
            },
            endDate: {
                type: Date,
            },
        },
    },
    {
        timestamps: true,
        collection: Collections.SoloStreaks,
    },
);

export const soloStreakModel: mongoose.Model<SoloStreakModel> = mongoose.model<SoloStreakModel>(
    Models.SoloStreak,
    soloStreakSchema,
);
