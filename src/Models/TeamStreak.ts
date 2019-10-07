import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { TeamStreak } from '@streakoid/streakoid-sdk/lib';
import StreakStatus from '@streakoid/streakoid-sdk/lib/StreakStatus';

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
            type: String,
            default: StreakStatus.live,
        },
        streakDescription: {
            type: String,
        },
        numberOfMinutes: {
            type: Number,
        },
        members: {
            type: [],
            default: [],
        },
        timezone: {
            required: true,
            type: String,
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
