import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';
import { userModel } from '../Models/User';
import { User } from '@streakoid/streakoid-models/lib/Models/User';

export const createUser = ({
    userIdentifier,
    timezone,
    username,
    temporaryPassword,
}: {
    userIdentifier: string;
    timezone: string;
    username: string;
    temporaryPassword: string;
}): Promise<User> => {
    const newUser = new userModel({
        userIdentifier,
        userType: UserTypes.temporary,
        timezone,
        username,
        cognitoUsername: username,
        temporaryPassword,
    });
    return newUser.save();
};
