import { streakoid } from '../../src/streakoid';
import { PopulatedCurrentUser } from '@streakoid/streakoid-models/lib/Models/PopulatedCurrentUser';
import { getServiceConfig } from '../../getServiceConfig';

const getUser = async (): Promise<PopulatedCurrentUser> => {
    const username = getServiceConfig().USER;
    const email = getServiceConfig().EMAIL;
    return streakoid.users.create({
        username,
        email,
    });
};

export { getUser };
