import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { TeamStreak } from '@streakoid/streakoid-models/lib/Models/TeamStreak';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';

export type TeamStreakModel = TeamStreak & mongoose.Document;

export const teamStreakSchema = new mongoose.Schema(
    {
        creatorId: {
            required: true,
            type: String,
        },
        streakName: {
            required: true,
            type: String,
        },
        status: {
            type: StreakStatus,
            default: StreakStatus.live,
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
        inviteKey: {
            type: String,
        },
        streakDescription: {
            type: String,
        },
        numberOfMinutes: {
            type: Number,
        },
        totalTimesTracked: {
            type: Number,
            default: 0,
        },
        members: {
            type: Array,
            default: [],
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
    },
    {
        timestamps: true,
        collection: Collections.TeamStreaks,
    },
);

export const teamStreakModel: mongoose.Model<TeamStreakModel> = mongoose.model<TeamStreakModel>(
    Models.TeamStreak,
    teamStreakSchema,
);
