import { isTestEnvironment } from '../setup/isTestEnvironment';
import { setupDatabase } from '../setup/setupDatabase';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from '../setup/streakoidTestSDK';
import { deleteSnsEndpoint } from '../helpers/deleteSnsEndpoint';
import { tearDownDatabase } from '../setup/tearDownDatabase';
import { disconnectDatabase } from '../setup/disconnectDatabase';
import { getPayingUser } from '../setup/getPayingUser';
import { getFriend } from '../setup/getFriend';
import { SNS } from '../../src/sns';
import { userModel } from '../../src/Models/User';
import { sendPushNotification } from '../../src/helpers/sendPushNotification';
import { CompletedTeamStreakUpdatePushNotification } from '@streakoid/streakoid-models/lib/Models/PushNotifications';
import PushNotificationTypes from '@streakoid/streakoid-models/lib/Types/PushNotificationTypes';
import { getServiceConfig } from '../../src/getServiceConfig';

const testName = 'sendPushNotification';

describe(testName, () => {
    let androidEndpointArn: string;
    let iosEndpointArn: string;
    let database: Mongoose;
    let SDK: StreakoidSDK;

    beforeEach(async () => {
        if (isTestEnvironment()) {
            database = await setupDatabase({ testName });
            SDK = streakoidTestSDK({ testName });
        }
    });

    afterEach(async () => {
        if (isTestEnvironment()) {
            if (androidEndpointArn) {
                await deleteSnsEndpoint({
                    endpointArn: androidEndpointArn,
                });
            }

            if (iosEndpointArn) {
                await deleteSnsEndpoint({
                    endpointArn: iosEndpointArn,
                });
            }

            await tearDownDatabase({ database });
        }
    });

    afterAll(async () => {
        if (isTestEnvironment()) {
            await disconnectDatabase({ database });
        }
    });

    test('sends android push notification via SNS if everything is correct.', async () => {
        expect.assertions(1);
        const user = await getPayingUser({ testName });

        const friend = await getFriend({ testName });

        const members = [{ memberId: user._id }, { memberId: friend._id }];

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: user._id,
            streakName: 'Spanish',
            members,
        });

        const updatedUser = await SDK.user.updateCurrentUser({
            updateData: {
                pushNotification: {
                    androidToken: getServiceConfig().ANDROID_TOKEN,
                },
            },
        });

        androidEndpointArn = updatedUser.pushNotification.androidEndpointArn || '';

        if (androidEndpointArn) {
            const title = `${teamStreak.streakName} update`;
            const body = `${user.username} has completed ${teamStreak.streakName}`;
            const data: CompletedTeamStreakUpdatePushNotification = {
                pushNotificationType: PushNotificationTypes.completedTeamStreakUpdate,
                teamStreakId: teamStreak._id,
                teamStreakName: teamStreak.streakName,
                title,
                body,
            };

            const result = await sendPushNotification({ title, body, data, userId: user._id, androidEndpointArn });
            expect(result).toBeDefined();
        }
    });

    test('if users androidEndpointArn is disabled the users android push notification settings are set to null.', async () => {
        expect.assertions(3);
        const user = await getPayingUser({ testName });

        const friend = await getFriend({ testName });

        const members = [{ memberId: user._id }, { memberId: friend._id }];

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: user._id,
            streakName: 'Spanish',
            members,
        });

        const updatedUser = await SDK.user.updateCurrentUser({
            updateData: {
                pushNotification: {
                    androidToken: getServiceConfig().ANDROID_TOKEN,
                },
            },
        });

        androidEndpointArn = updatedUser.pushNotification.androidEndpointArn || '';

        if (androidEndpointArn) {
            await SNS.setEndpointAttributes({
                EndpointArn: androidEndpointArn,
                Attributes: { Enabled: 'false' },
            }).promise();

            const title = `${teamStreak.streakName} update`;
            const body = `${user.username} has completed ${teamStreak.streakName}`;
            const data: CompletedTeamStreakUpdatePushNotification = {
                pushNotificationType: PushNotificationTypes.completedTeamStreakUpdate,
                teamStreakId: teamStreak._id,
                teamStreakName: teamStreak.streakName,
                title,
                body,
            };

            try {
                await sendPushNotification({ title, body, data, userId: user._id, androidEndpointArn });
            } catch (err) {
                expect(err.code).toEqual('EndpointDisabled');
                const userResult = await userModel.findById(updatedUser._id);
                expect(userResult && userResult.pushNotification.androidToken).toEqual(null);
                expect(userResult && userResult.pushNotification.androidEndpointArn).toEqual(null);
            }
        }
    });

    test('sends ios push notification via SNS if everything is correct.', async () => {
        expect.assertions(1);
        const user = await getPayingUser({ testName });

        const friend = await getFriend({ testName });

        const members = [{ memberId: user._id }, { memberId: friend._id }];

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: user._id,
            streakName: 'Spanish',
            members,
        });

        const updatedUser = await SDK.user.updateCurrentUser({
            updateData: {
                pushNotification: {
                    iosToken: getServiceConfig().IOS_TOKEN,
                },
            },
        });

        iosEndpointArn = updatedUser.pushNotification.iosEndpointArn || '';

        if (iosEndpointArn) {
            const title = `${teamStreak.streakName} update`;
            const body = `${user.username} has completed ${teamStreak.streakName}`;
            const data: CompletedTeamStreakUpdatePushNotification = {
                pushNotificationType: PushNotificationTypes.completedTeamStreakUpdate,
                teamStreakId: teamStreak._id,
                teamStreakName: teamStreak.streakName,
                title,
                body,
            };

            const result = await sendPushNotification({ title, body, data, userId: user._id, iosEndpointArn });
            expect(result).toBeDefined();
        }
    });

    test('if users iosEndpointArn is disabled the users ios push notification settings are set to null.', async () => {
        expect.assertions(3);
        const user = await getPayingUser({ testName });

        const friend = await getFriend({ testName });

        const members = [{ memberId: user._id }, { memberId: friend._id }];

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: user._id,
            streakName: 'Spanish',
            members,
        });

        const updatedUser = await SDK.user.updateCurrentUser({
            updateData: {
                pushNotification: {
                    iosToken: getServiceConfig().IOS_TOKEN,
                },
            },
        });

        iosEndpointArn = updatedUser.pushNotification.iosEndpointArn || '';

        if (iosEndpointArn) {
            await SNS.setEndpointAttributes({
                EndpointArn: iosEndpointArn,
                Attributes: { Enabled: 'false' },
            }).promise();

            const title = `${teamStreak.streakName} update`;
            const body = `${user.username} has completed ${teamStreak.streakName}`;
            const data: CompletedTeamStreakUpdatePushNotification = {
                pushNotificationType: PushNotificationTypes.completedTeamStreakUpdate,
                teamStreakId: teamStreak._id,
                teamStreakName: teamStreak.streakName,
                title,
                body,
            };

            try {
                await sendPushNotification({ title, body, data, userId: user._id, iosEndpointArn });
            } catch (err) {
                expect(err.code).toEqual('EndpointDisabled');
                const userResult = await userModel.findById(updatedUser._id);
                expect(userResult && userResult.pushNotification.iosToken).toEqual(null);
                expect(userResult && userResult.pushNotification.iosEndpointArn).toEqual(null);
            }
        }
    });
});
