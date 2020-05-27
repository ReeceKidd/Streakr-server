import { PopulatedCurrentUser } from '@streakoid/streakoid-models/lib/Models/PopulatedCurrentUser';

import { streakoidTestSDKFactory } from '../../src/SDK/streakoidTestSDKFactory';
export const friendUsername = 'friend';
export const friendEmail = 'friend@gmail.com';

const getFriend = async ({ testName }: { testName: string }): Promise<PopulatedCurrentUser> => {
    return streakoidTestSDKFactory({ testName }).users.create({
        username: friendUsername,
        email: friendEmail,
    });
};

export { getFriend };
