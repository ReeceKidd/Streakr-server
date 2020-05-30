import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';
import { userModel } from '../Models/User';
import { User } from '@streakoid/streakoid-models/lib/Models/User';

export const createUser = ({
    userIdentifier,
    timezone,
    username,
}: {
    userIdentifier: string;
    timezone: string;
    username: string;
}): Promise<User> => {
    const newUser = new userModel({
        userIdentifier,
        userType: UserTypes.unregistered,
        timezone,
        username,
    });
    return newUser.save();
};
