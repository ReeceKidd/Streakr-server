import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { User } from '@streakoid/streakoid-sdk/lib';
import UserTypes from '@streakoid/streakoid-sdk/lib/userTypes';

export type UserModel = User & mongoose.Document;

export const originalImageUrl = 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg';

export const userSchema = new mongoose.Schema(
    {
        username: {
            required: true,
            type: String,
            unique: true,
            trim: true,
        },
        membershipInformation: {
            isPayingMember: {
                type: Boolean,
                default: false,
            },
            currentMembershipStartDate: {
                type: Date,
                default: null,
            },
            pastMemberships: {
                type: Array,
                default: [],
            },
        },
        email: {
            required: true,
            type: String,
            unique: true,
            trim: true,
        },
        userType: {
            type: String,
            enum: [UserTypes.basic, UserTypes.admin],
            default: UserTypes.basic,
        },
        timezone: {
            type: String,
            required: true,
        },
        profileImages: {
            type: Object,
            default: {
                originalImageUrl,
            },
        },
        friends: {
            type: Array,
            default: [],
        },
        notifications: {
            completeSoloStreaksReminder: {
                emailNotification: {
                    type: Boolean,
                    default: false,
                },
                pushNotification: {
                    type: Boolean,
                    default: false,
                },
                reminderTime: {
                    type: Number,
                    default: 21,
                },
            },
            friendRequest: {
                emailNotification: {
                    type: Boolean,
                    default: false,
                },
                pushNotification: {
                    type: Boolean,
                    default: false,
                },
            },
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
        pushNotificationToken: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
        collection: Collections.Users,
    },
);

export const userModel: mongoose.Model<UserModel> = mongoose.model<UserModel>(Models.User, userSchema);
