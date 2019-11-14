import { CurrentUser } from '@streakoid/streakoid-sdk/lib';

import streakoid from '../../src/streakoid';

export const friendUsername = 'friend';
export const friendEmail = 'friend@gmail.com';

const getFriend = async (): Promise<CurrentUser> => {
    return streakoid.users.create({ username: friendUsername, email: friendEmail });
};

export { getFriend };
