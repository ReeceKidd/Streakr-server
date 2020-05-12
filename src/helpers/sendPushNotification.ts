/* eslint-disable @typescript-eslint/no-explicit-any */
import { SNS } from '../../src/sns';
import PushNotificationSupportedDeviceTypes from '@streakoid/streakoid-models/lib/Types/PushNotificationSupportedDeviceTypes';
import { PushNotificationType } from '@streakoid/streakoid-models/lib/Models/PushNotifications';

const buildAPSPayloadString = ({ message, data }: { message: string; data: PushNotificationType }): string => {
    return JSON.stringify({
        data,
        aps: {
            alert: message,
        },
    });
};
const buildFCMPayloadString = ({
    title,
    body,
    data,
}: {
    title: string;
    body: string;
    data: PushNotificationType;
}): string => {
    return JSON.stringify({
        data,
        notification: {
            title,
            body,
        },
    });
};

export const sendPushNotification = ({
    endpoint,
    platform,
    title,
    body,
    data,
}: {
    endpoint: string;
    platform: PushNotificationSupportedDeviceTypes;
    title: string;
    body: string;
    data: PushNotificationType;
}): Promise<unknown> => {
    let payloadKey,
        payload = '';
    if (platform === PushNotificationSupportedDeviceTypes.ios) {
        payloadKey = 'APNS';
        payload = buildAPSPayloadString({ message: body, data });
    } else if (platform === PushNotificationSupportedDeviceTypes.android) {
        payloadKey = 'FCM';
        payload = buildFCMPayloadString({ title, body, data });
    } else {
        throw new Error('Unsupported platform');
    }
    const snsMessage = {
        [payloadKey]: payload,
    };

    const snsParams = {
        Message: JSON.stringify(snsMessage),
        TargetArn: endpoint,
        MessageStructure: 'json',
    };
    console.log(snsParams);
    return SNS.publish(snsParams).promise();
};
