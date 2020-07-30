import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { FormattedUser } from '@streakoid/streakoid-models/lib/Models/FormattedUser';

export const getFormattedUser = ({ user }: { user: User }): FormattedUser => {
    const formattedUser: FormattedUser = {
        _id: user._id,
        username: user.username,
        isPayingMember: user.membershipInformation.isPayingMember,
        userType: user.userType,
        timezone: user.timezone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        profileImages: user.profileImages,
        pushNotification: user.pushNotification,
        totalStreakCompletes: Number(user.totalStreakCompletes),
        longestEverStreakNumberOfDays: user.longestEverStreak.numberOfDays || 0,
    };
    return formattedUser;
};
