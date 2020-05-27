import { PopulatedCurrentUser } from '@streakoid/streakoid-models/lib/Models/PopulatedCurrentUser';
import _ from 'lodash';

export const hasCorrectPopulatedCurrentUserKeys = (user: PopulatedCurrentUser) => {
    return _.isEqual(
        Object.keys(user).sort(),
        [
            '_id',
            'createdAt',
            'email',
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
            'onboarding',
            'hasCompletedOnboarding',
            'timezone',
            'updatedAt',
            'userType',
            'username',
        ].sort(),
    );
};
