import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';
import StreakReminderTypes from '@streakoid/streakoid-models/lib/Types/StreakReminderTypes';
import WhyDoYouWantToBuildNewHabitsTypes from '@streakoid/streakoid-models/lib/Types/WhyDoYouWantToBuildNewHabitsTypes';
import PushNotificationSupportedDeviceTypes from '@streakoid/streakoid-models/lib/Types/PushNotificationSupportedDeviceTypes';
import { User } from '@streakoid/streakoid-models/lib/Models/User';

export const getMockUser = (): User => ({
    _id: '_id',
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
        token: 'token',
        endpointArn: 'endpointArn',
        deviceType: PushNotificationSupportedDeviceTypes.android,
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
    onboarding: {
        whyDoYouWantToBuildNewHabitsChoice: WhyDoYouWantToBuildNewHabitsTypes.education,
    },
    hasCompletedOnboarding: false,
    stripe: {
        customer: 'abc',
        subscription: 'sub_1',
    },
    achievements: [],
});
