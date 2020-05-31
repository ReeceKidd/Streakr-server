import { PopulatedCurrentUser } from '@streakoid/streakoid-models/lib/Models/PopulatedCurrentUser';
import _ from 'lodash';

export const hasCorrectPopulatedCurrentUserKeys = (user: PopulatedCurrentUser): boolean => {
    return _.isEqual(
        Object.keys(user).sort(),
        [
            '_id',
            'createdAt',
            'email',
            'temporaryPassword',
            'followers',
            'following',
            'totalStreakCompletes',
            'totalLiveStreaks',
            'achievements',
            'membershipInformation',
            'pushNotifications',
            'profileImages',
            'pushNotification',
            'hasCompletedTutorial',
            'hasCompletedIntroduction',
            'onboarding',
            'hasCompletedOnboarding',
            'timezone',
            'updatedAt',
            'userType',
            'username',
        ].sort(),
    );
};
