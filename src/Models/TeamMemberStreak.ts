import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { TeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/TeamMemberStreak';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';

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
        status: {
            type: String,
            default: StreakStatus.live,
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
        totalTimesTracked: {
            type: Number,
            default: 0,
        },
        longestTeamMemberStreak: {
            teamMemberStreakId: {
                type: String,
                default: null,
            },
            teamStreakId: {
                type: String,
                default: null,
            },
            teamStreakName: {
                type: String,
                default: null,
            },
            numberOfDays: {
                type: Number,
                default: 0,
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
        collection: Collections.TeamMemberStreaks,
    },
);

export const teamMemberStreakModel: mongoose.Model<TeamMemberStreakModel> = mongoose.model<TeamMemberStreakModel>(
    Models.TeamMemberStreak,
    teamMemberStreakSchema,
);
