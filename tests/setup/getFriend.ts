import { PopulatedCurrentUser } from '@streakoid/streakoid-models/lib/Models/PopulatedCurrentUser';
import { streakoidTestSDK } from './streakoidTestSDK';

export const friendUsername = 'friend';
export const friendEmail = 'friend@gmail.com';

const getFriend = async ({ testName }: { testName: string }): Promise<PopulatedCurrentUser> => {
    return streakoidTestSDK({ testName }).users.create({
        username: friendUsername,
        email: friendEmail,
    });
};

export { getFriend };
