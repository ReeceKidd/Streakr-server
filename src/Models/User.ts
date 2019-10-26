import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { User } from '@streakoid/streakoid-sdk/lib';
import UserTypes from '@streakoid/streakoid-sdk/lib/userTypes';

export type UserModel = User & mongoose.Document;

export const userSchema = new mongoose.Schema(
    {
        username: {
            required: true,
            type: String,
            unique: true,
            trim: true,
        },
        email: {
            required: true,
            type: String,
            unique: true,
            trim: true,
        },
        userType: {
            type: String,
            enum: [UserTypes.basic, UserTypes.premium, UserTypes.admin],
            default: UserTypes.basic,
        },
        timezone: {
            type: String,
            required: true,
        },
        profileImages: {
            type: Object,
            default: {
                originalImageUrl: 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg',
            },
        },
        friends: {
            type: Array,
            default: [],
        },
        stripe: {
            customer: {
                type: String,
                default: null,
            },
            subscription: {
                type: String,
                default: null,
            },
        },
    },
    {
        timestamps: true,
        collection: Collections.Users,
    },
);
userSchema.index({ username: 'text' });
userSchema.index({ email: 'text' });

export const userModel: mongoose.Model<UserModel> = mongoose.model<UserModel>(Models.User, userSchema);
