import { CurrentUser } from '@streakoid/streakoid-sdk/lib';
import streakoid from '../../src/streakoid';
import { getServiceConfig } from '../../src/getServiceConfig';
import { userModel } from '../../src/Models/User';
const { COGNITO_USERNAME, COGNITO_EMAIL } = getServiceConfig();

const getPayingUser = async (): Promise<CurrentUser> => {
    const user = await streakoid.user.create({
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
            notifications: {
                completeStreaksReminder: {
                    pushNotification: true,
                    reminderTime: 21,
                },
            },
            pushNotificationToken: 'ExponentPushToken[hC0rRYEqr3N-IhTsr4h-Xo]',
        },
    });
    if (!updatedUser) {
        throw new Error('Cannot find user to update');
    }
    return updatedUser;
};

export { getPayingUser };
