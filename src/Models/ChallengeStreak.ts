import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { ChallengeStreak } from '@streakoid/streakoid-models/lib/Models/ChallengeStreak';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

export type ChallengeStreakModel = ChallengeStreak & mongoose.Document;

export const challengeStreakSchema = new mongoose.Schema(
    {
        userId: {
            required: true,
            type: String,
            index: true,
        },
        challengeId: {
            required: true,
            type: String,
        },
        username: {
            type: String,
        },
        userProfileImage: {
            type: String,
        },
        challengeName: {
            type: String,
        },
        status: {
            type: String,
            default: StreakStatus.live,
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
        longestChallengeStreak: {
            challengeStreakId: {
                type: String,
                default: null,
            },
            challengeId: {
                type: String,
                default: null,
            },
            challengeName: {
                type: String,
                default: null,
            },
            streakType: {
                type: String,
                default: StreakTypes.challenge,
            },
            startDate: {
                type: Date,
            },
            numberOfDays: {
                type: Number,
                default: 0,
            },
            endDate: {
                type: Date,
            },
        },
    },
    {
        timestamps: true,
        collection: Collections.ChallengeStreaks,
    },
);

export const challengeStreakModel: mongoose.Model<ChallengeStreakModel> = mongoose.model<ChallengeStreakModel>(
    Models.ChallengeStreak,
    challengeStreakSchema,
);
