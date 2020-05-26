import { PopulatedCurrentUser } from '@streakoid/streakoid-models/lib/Models/PopulatedCurrentUser';

import { testSDK } from '../SDK/testSDK';
import { getDatabaseURI } from './getDatabaseURI';
export const friendUsername = 'friend';
export const friendEmail = 'friend@gmail.com';

const getFriend = async ({ testName }: { testName: string }): Promise<PopulatedCurrentUser> => {
    return testSDK({ databaseURI: getDatabaseURI({ testName }) }).users.create({
        username: friendUsername,
        email: friendEmail,
    });
};

export { getFriend };
