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
        databaseName: {
            type: String,
            required: true,
            index: true,
        },
        description: {
            type: String,
        },
        icon: {
            type: String,
        },
        color: {
            type: String,
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
        whatsappGroupLink: {
            type: String,
        },
        discordGroupLink: {
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
