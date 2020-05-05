import streakoid from '../../src/streakoid';
import { PopulatedCurrentUser } from '@streakoid/streakoid-models/lib/Models/PopulatedCurrentUser';

export const friendUsername = 'friend';
export const friendEmail = 'friend@gmail.com';

const getFriend = async (): Promise<PopulatedCurrentUser> => {
    return streakoid.users.create({ username: friendUsername, email: friendEmail });
};

export { getFriend };
