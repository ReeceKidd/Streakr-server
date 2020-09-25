import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';
import { getServiceConfig } from '../../src/getServiceConfig';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

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
        coins: {
            type: Number,
            default: 0,
        },
        totalCoins: {
            type: Number,
            default: 0,
        },
        oidXp: {
            type: Number,
            default: 0,
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
            androidToken: {
                type: String,
                default: null,
            },
            iosToken: {
                type: String,
                default: null,
            },
            androidEndpointArn: {
                type: String,
                default: null,
            },
            iosEndpointArn: {
                type: String,
                default: null,
            },
            //Legacy
            token: {
                type: String,
            },
            //Legacy
            endpointArn: {
                type: String,
            },
            //Legacy
            deviceType: {
                type: String,
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
        teamStreaksOrder: {
            type: Array,
            default: [],
        },
        longestSoloStreak: {
            soloStreakId: {
                type: String,
                default: null,
            },
            soloStreakName: {
                type: String,
                default: null,
            },
            numberOfDays: {
                type: Number,
                default: 0,
            },
            streakType: {
                type: String,
                default: StreakTypes.solo,
            },
            startDate: {
                type: Date,
            },
            endDate: {
                type: Date,
            },
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
            numberOfDays: {
                type: Number,
                default: 0,
            },
            streakType: {
                type: String,
                default: StreakTypes.challenge,
            },
            startDate: {
                type: Date,
            },
            endDate: {
                type: Date,
            },
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
            streakType: {
                type: String,
                default: StreakTypes.teamMember,
            },
            startDate: {
                type: Date,
            },
            endDate: {
                type: Date,
            },
        },
        longestTeamStreak: {
            teamStreakId: {
                type: String,
                default: null,
            },
            teamStreakName: {
                type: String,
                default: null,
            },
            members: {
                type: Array,
                default: [],
            },
            numberOfDays: {
                type: Number,
                default: 0,
            },
            streakType: {
                type: String,
                default: StreakTypes.team,
            },
            startDate: {
                type: Date,
            },
            endDate: {
                type: Date,
            },
        },
        longestEverStreak: {
            soloStreakId: {
                type: String,
                default: null,
            },
            soloStreakName: {
                type: String,
                default: null,
            },
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
            members: {
                type: Array,
                default: [],
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
            streakType: {
                type: String,
            },
        },
        longestCurrentStreak: {
            soloStreakId: {
                type: String,
                default: null,
            },
            soloStreakName: {
                type: String,
                default: null,
            },
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
            members: {
                type: Array,
                default: [],
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
            streakType: {
                type: String,
            },
        },
    },
    {
        timestamps: true,
        collection: Collections.Users,
    },
);

export const userModel: mongoose.Model<UserModel> = mongoose.model<UserModel>(Models.User, userSchema);
