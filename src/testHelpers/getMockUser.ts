import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';
import StreakReminderTypes from '@streakoid/streakoid-models/lib/Types/StreakReminderTypes';
import WhyDoYouWantToBuildNewHabitsTypes from '@streakoid/streakoid-models/lib/Types/WhyDoYouWantToBuildNewHabitsTypes';
import { User } from '@streakoid/streakoid-models/lib/Models/User';

export const getMockUser = ({ _id }: { _id: string }): User => ({
    _id,
    username: 'username',
    cognitoUsername: 'username',
    hasUsernameBeenCustomized: false,
    userIdentifier: 'userIdentifier',
    membershipInformation: {
        isPayingMember: true,
        currentMembershipStartDate: new Date(),
        pastMemberships: [],
    },
    email: 'test@test.com',
    temporaryPassword: '12345',
    oidXp: 0,
    coins: 0,
    createdAt: 'Jan 1st',
    updatedAt: 'Jan 1st',
    timezone: 'Europe/London',
    userType: UserTypes.basic,
    totalStreakCompletes: 10,
    totalLiveStreaks: 0,
    followers: [],
    following: [],
    profileImages: {
        originalImageUrl: 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg',
    },
    hasProfileImageBeenCustomized: false,
    pushNotification: {
        androidToken: 'token',
        iosToken: 'iosToken',
        androidEndpointArn: 'androidEndpointArn',
        iosEndpointArn: 'iosEndpointArn',
    },
    pushNotifications: {
        completeAllStreaksReminder: {
            enabled: true,
            expoId: 'expoId',
            reminderHour: 10,
            reminderMinute: 15,
            streakReminderType: StreakReminderTypes.completeAllStreaksReminder,
        },
        teamStreakUpdates: {
            enabled: true,
        },
        newFollowerUpdates: {
            enabled: true,
        },
        achievementUpdates: {
            enabled: true,
        },
        customStreakReminders: [],
    },
    hasCompletedIntroduction: true,
    hasCompletedTutorial: false,
    hasVerifiedEmail: true,
    hasCustomPassword: true,
    onboarding: {
        whyDoYouWantToBuildNewHabitsChoice: WhyDoYouWantToBuildNewHabitsTypes.education,
    },
    hasCompletedOnboarding: false,
    stripe: {
        customer: 'abc',
        subscription: 'sub_1',
    },
    achievements: [],
    teamStreaksOrder: [],
    longestSoloStreak: {
        soloStreakId: 'soloStreakId',
        soloStreakName: 'Reading',
        numberOfDays: 20,
        startDate: new Date(),
        endDate: new Date(),
    },
    longestChallengeStreak: {
        challengeId: 'challengeId',
        challengeName: 'Writing',
        challengeStreakId: 'challengeStreakId',
        numberOfDays: 20,
        startDate: new Date(),
        endDate: new Date(),
    },
    longestTeamMemberStreak: {
        teamStreakId: 'teamStreakId',
        teamMemberStreakId: 'teamMemberStreakId',
        teamStreakName: 'Running',
        startDate: new Date(),
        endDate: new Date(),
        numberOfDays: 20,
    },
    longestTeamStreak: {
        teamStreakId: 'teamStreakId',
        members: [],
        numberOfDays: 4,
        startDate: new Date(),
        endDate: new Date(),
        teamStreakName: 'Yoga',
    },
});
