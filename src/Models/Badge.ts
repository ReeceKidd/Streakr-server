import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { Badge } from '@streakoid/streakoid-sdk/lib';

export type BadgeModel = Badge & mongoose.Document;

export const badgeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        levels: {
            type: [
                {
                    level: Number,
                    color: String,
                    criteria: String,
                },
            ],
            default: [],
        },
        icon: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        collection: Collections.Badges,
    },
);

export const badgeModel: mongoose.Model<BadgeModel> = mongoose.model<BadgeModel>(Models.Badge, badgeSchema);
