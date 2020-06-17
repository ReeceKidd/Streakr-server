import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';
import { getServiceConfig } from '../../src/getServiceConfig';
const { DEFAULT_USER_PROFILE_IMAGE_URL } = getServiceConfig();

export type UserModel = User & mongoose.Document;

export const originalImageUrl = DEFAULT_USER_PROFILE_IMAGE_URL;

export const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            index: true,
            trim: true,
        },
        cognitoUsername: {
            type: String,
            required: true,
            index: true,
            unique: true,
            trim: true,
        },
        temporaryPassword: {
            type: String,
            default: null,
        },
        firstName: {
            type: String,
            default: null,
        },
        lastName: {
            type: String,
            default: null,
        },
        hasUsernameBeenCustomized: {
            type: Boolean,
            default: false,
        },
        userIdentifier: {
            type: String,
            default: null,
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
            type: String,
            trim: true,
            default: null,
        },
        userType: {
            type: String,
            enum: [UserTypes.basic, UserTypes.admin, UserTypes.temporary],
            default: UserTypes.temporary,
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
        hasProfileImageBeenCustomized: {
            type: Boolean,
            default: false,
        },
        followers: {
            type: Array,
            default: [],
        },
        following: {
            type: Array,
            default: [],
        },
        totalStreakCompletes: {
            type: Number,
            default: 0,
        },
        totalLiveStreaks: {
            type: Number,
            default: 0,
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
        pushNotification: {
            token: {
                type: String,
                default: null,
            },
            endpointArn: {
                type: String,
                default: null,
            },
            deviceType: {
                type: String,
                default: null,
            },
        },
        pushNotifications: {
            completeAllStreaksReminder: {
                type: {
                    enabled: {
                        type: Boolean,
                    },
                    expoId: {
                        type: String,
                    },
                    reminderHour: {
                        type: Number,
                    },
                    reminderMinute: {
                        type: Number,
                    },
                    streakReminderType: {
                        type: String,
                    },
                },
                required: false,
            },
            customStreakReminders: {
                type: Array,
                default: [],
            },
            teamStreakUpdates: {
                enabled: {
                    type: Boolean,
                    default: true,
                },
            },
            newFollowerUpdates: {
                enabled: {
                    type: Boolean,
                    default: true,
                },
            },
            achievementUpdates: {
                enabled: {
                    type: Boolean,
                    default: true,
                },
            },
        },
        achievements: {
            type: Array,
            default: [],
        },
        hasCompletedTutorial: {
            type: Boolean,
            default: false,
        },
        hasCompletedIntroduction: {
            type: Boolean,
            default: true,
        },
        onboarding: {
            whyDoYouWantToBuildNewHabitsChoice: { type: String, default: null },
        },
        hasCompletedOnboarding: {
            type: Boolean,
            default: false,
        },
        hasVerifiedEmail: {
            type: Boolean,
            default: false,
        },
        hasCustomPassword: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        collection: Collections.Users,
    },
);

export const userModel: mongoose.Model<UserModel> = mongoose.model<UserModel>(Models.User, userSchema);
