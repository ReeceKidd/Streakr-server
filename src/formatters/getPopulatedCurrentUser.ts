import { PopulatedCurrentUser } from '@streakoid/streakoid-models/lib/Models/PopulatedCurrentUser';
import { BasicUser } from '@streakoid/streakoid-models/lib/Models/BasicUser';
import { DatabaseAchievementType } from '@streakoid/streakoid-models/lib/Models/DatabaseAchievement';
import { User } from '@streakoid/streakoid-models/lib/Models/User';

export const getPopulatedCurrentUser = ({
    user,
    followers,
    following,
    achievements,
}: {
    user: User;
    following: BasicUser[];
    followers: BasicUser[];
    achievements: DatabaseAchievementType[];
}): PopulatedCurrentUser => {
    const populatedCurrentUser: PopulatedCurrentUser = {
        _id: user._id,
        email: user.email,
        temporaryPassword: user.temporaryPassword,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        coins: user.coins,
        totalCoins: user.totalCoins,
        oidXp: user.oidXp,
        hasUsernameBeenCustomized: user.hasUsernameBeenCustomized,
        membershipInformation: user.membershipInformation,
        userType: user.userType,
        timezone: user.timezone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        pushNotification: user.pushNotification,
        pushNotifications: user.pushNotifications,
        hasProfileImageBeenCustomized: user.hasProfileImageBeenCustomized,
        profileImages: user.profileImages,
        hasCompletedTutorial: user.hasCompletedTutorial,
        hasCompletedIntroduction: user.hasCompletedIntroduction,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
        hasCustomPassword: user.hasCustomPassword,
        hasVerifiedEmail: user.hasVerifiedEmail,
        onboarding: user.onboarding,
        teamStreaksOrder: user.teamStreaksOrder,
        totalStreakCompletes: Number(user.totalStreakCompletes),
        totalLiveStreaks: Number(user.totalLiveStreaks),
        longestSoloStreak: user.longestSoloStreak,
        longestChallengeStreak: user.longestChallengeStreak,
        longestTeamMemberStreak: user.longestTeamMemberStreak,
        longestTeamStreak: user.longestTeamStreak,
        longestEverStreak: user.longestEverStreak,
        longestCurrentStreak: user.longestCurrentStreak,
        stripe: user.stripe,
        achievements,
        followers,
        following,
    };
    return populatedCurrentUser;
};
