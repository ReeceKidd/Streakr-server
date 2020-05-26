import { PopulatedCurrentUser } from '@streakoid/streakoid-models/lib/Models/PopulatedCurrentUser';

import { testSDK } from '../testSDK/testSDK';
export const friendUsername = 'friend';
export const friendEmail = 'friend@gmail.com';

const getFriend = async (): Promise<PopulatedCurrentUser> => {
    return testSDK.users.create({ username: friendUsername, email: friendEmail });
};

export { getFriend };
