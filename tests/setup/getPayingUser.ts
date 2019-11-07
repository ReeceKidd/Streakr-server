import { User } from '@streakoid/streakoid-sdk/lib';
import streakoid from '../../src/streakoid';
import { getServiceConfig } from '../../src/getServiceConfig';
import { userModel } from '../../src/Models/User';
const { COGNITO_USERNAME, COGNITO_EMAIL } = getServiceConfig();

const getPayingUser = async (): Promise<User> => {
    const user = await streakoid.users.create({
        username: COGNITO_USERNAME,
        email: COGNITO_EMAIL,
    });
    const updatedUser = await userModel.findByIdAndUpdate(user._id, {
        $set: {
            membershipInformation: {
                isPayingMember: true,
                currentMembershipStartDate: new Date(),
            },
        },
    });
    if (!updatedUser) {
        throw new Error('Cannot find user to update');
    }
    return updatedUser;
};

export { getPayingUser };
