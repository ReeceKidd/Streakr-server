/* eslint-disable @typescript-eslint/no-explicit-any */
import { SNS } from '../../src/sns';
import PushNotificationSupportedDeviceTypes from '@streakoid/streakoid-models/lib/Types/PushNotificationSupportedDeviceTypes';
import { PushNotificationType } from '@streakoid/streakoid-models/lib/Models/PushNotifications';

const buildAPSPayloadString = ({ body, data }: { body: string; data: PushNotificationType }): string => {
    return JSON.stringify({
        aps: {
            alert: body,
            'content-available': 1,
        },
        data,
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
        notification: {
            title,
            body,
        },
        data,
    });
};

export const sendPushNotification = ({
    endpointArn,
    deviceType,
    title,
    body,
    data,
}: {
    endpointArn: string;
    deviceType: PushNotificationSupportedDeviceTypes;
    title: string;
    body: string;
    data: PushNotificationType;
}): Promise<unknown> => {
    let payloadKey,
        payload = '';
    if (deviceType === PushNotificationSupportedDeviceTypes.ios) {
        payloadKey = 'APNS';
        payload = buildAPSPayloadString({ body, data });
    } else if (deviceType === PushNotificationSupportedDeviceTypes.android) {
        payloadKey = 'GCM';
        payload = buildFCMPayloadString({ title, body, data });
    } else {
        payloadKey = 'default';
        payload = body;
    }
    const snsMessage = {
        [payloadKey]: payload,
    };

    const snsParams = {
        Message: JSON.stringify(snsMessage),
        TargetArn: endpointArn,
        MessageStructure: 'json',
    };
    return SNS.publish(snsParams).promise();
};
