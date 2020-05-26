import { getServiceConfig } from '../../src/getServiceConfig';
import { userModel, UserModel } from '../../src/Models/User';
import { testSDK } from '../SDK/testSDK';
import { getDatabaseURI } from './getDatabaseURI';

const { COGNITO_USERNAME, COGNITO_EMAIL } = getServiceConfig();

const getPayingUser = async ({ testName }: { testName: string }): Promise<UserModel> => {
    const user = await testSDK({ databaseURI: getDatabaseURI({ testName }) }).users.create({
        username: COGNITO_USERNAME,
        email: COGNITO_EMAIL,
    });
    const updatedUser = await userModel.findByIdAndUpdate(user._id, {
        $set: {
            membershipInformation: {
                isPayingMember: true,
                currentMembershipStartDate: new Date(),
            },
            timezone: 'Europe/London',
            pushNotificationToken: 'pushNotification',
        },
    });
    if (!updatedUser) {
        throw new Error('Cannot find user to update');
    }
    return updatedUser;
};

export { getPayingUser };
