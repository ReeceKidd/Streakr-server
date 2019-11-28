import { PopulatedCurrentUser } from '@streakoid/streakoid-sdk/lib';

import streakoid from '../../src/streakoid';

export const friendUsername = 'friend';
export const friendEmail = 'friend@gmail.com';

const getFriend = async (): Promise<PopulatedCurrentUser> => {
    return streakoid.users.create({ username: friendUsername, email: friendEmail });
};

export { getFriend };
