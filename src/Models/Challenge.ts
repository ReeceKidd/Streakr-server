import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { Challenge } from '@streakoid/streakoid-sdk/lib';

export type ChallengeModel = Challenge & mongoose.Document;

export const challengeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        badgeId: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        levels: {
            type: [{ level: Number, criteria: String }],
            default: [],
        },
        members: {
            type: [String],
            default: [],
        },
        numberOfMembers: {
            type: Number,
            default: 0,
        },
        numberOfMinutes: {
            type: Number,
        },
        communicationGroupLink: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: Collections.Challenges,
    },
);

export const challengeModel: mongoose.Model<ChallengeModel> = mongoose.model<ChallengeModel>(
    Models.Challenge,
    challengeSchema,
);
