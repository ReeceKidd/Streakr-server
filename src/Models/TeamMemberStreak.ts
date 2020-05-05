import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { TeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/TeamMemberStreak';

export type TeamMemberStreakModel = TeamMemberStreak & mongoose.Document;

export const teamMemberStreakSchema = new mongoose.Schema(
    {
        userId: {
            required: true,
            type: String,
            index: true,
        },
        teamStreakId: {
            required: true,
            type: String,
            index: true,
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
    },
    {
        timestamps: true,
        collection: Collections.TeamMemberStreaks,
    },
);

export const teamMemberStreakModel: mongoose.Model<TeamMemberStreakModel> = mongoose.model<TeamMemberStreakModel>(
    Models.TeamMemberStreak,
    teamMemberStreakSchema,
);
