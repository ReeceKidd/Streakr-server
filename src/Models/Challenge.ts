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
        icon: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        members: {
            type: [{ username: String, userId: String, profileImage: String }],
            default: [],
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
