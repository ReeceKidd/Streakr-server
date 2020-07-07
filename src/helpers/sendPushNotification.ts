/* eslint-disable @typescript-eslint/no-explicit-any */
import { SNS } from '../../src/sns';
import { PushNotificationType } from '@streakoid/streakoid-models/lib/Models/PushNotifications';
import { userModel } from '../Models/User';
import { PushNotificationRecord } from '@streakoid/streakoid-models/lib/Models/PushNotificationRecord';
import { pushNotificationRecordModel } from '../Models/PushNotificationRecord';
import PushNotificationTypes from '@streakoid/streakoid-models/lib/Types/PushNotificationTypes';

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

export const sendSNSPushNotification = async ({
    title,
    body,
    data,
    androidEndpointArn,
    iosEndpointArn,
}: {
    title: string;
    body: string;
    data: PushNotificationType;
    androidEndpointArn?: string;
    iosEndpointArn?: string;
}): Promise<unknown> => {
    if (!androidEndpointArn && !iosEndpointArn) {
        throw new Error('Either androidEndpointArn or iosEndpointArn must be defined');
    }
    let payloadKey,
        payload = '';
    if (iosEndpointArn) {
        payloadKey = 'APNS';
        payload = buildAPSPayloadString({ body, data });
    } else if (androidEndpointArn) {
        payloadKey = 'GCM';
        payload = buildFCMPayloadString({ title, body, data });
    } else {
        payloadKey = 'default';
        payload = body;
    }
    const snsMessage = {
        [payloadKey]: payload,
    };

    if (androidEndpointArn) {
        const snsParams = {
            Message: JSON.stringify(snsMessage),
            TargetArn: androidEndpointArn,
            MessageStructure: 'json',
        };

        return SNS.publish(snsParams).promise();
    }

    const snsParams = {
        Message: JSON.stringify(snsMessage),
        TargetArn: iosEndpointArn,
        MessageStructure: 'json',
    };

    return SNS.publish(snsParams).promise();
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const sendPushNotification = async ({
    title,
    data,
    userId,
    body,
    pushNotificationType,
    androidEndpointArn,
    iosEndpointArn,
}: {
    title: string;
    data: PushNotificationType;
    userId: string;
    body: string;
    pushNotificationType: PushNotificationTypes;
    androidEndpointArn?: string;
    iosEndpointArn?: string;
}): Promise<PushNotificationRecord> => {
    try {
        await sendSNSPushNotification({ title, data, body, androidEndpointArn, iosEndpointArn });
        const pushNotificationRecord = new pushNotificationRecordModel({
            userId,
            pushNotificationType,
            title,
            body,
            data,
            androidEndpointArn,
            iosEndpointArn,
        });
        return pushNotificationRecord.save();
    } catch (err) {
        if (err.code == 'EndpointDisabled') {
            if (androidEndpointArn) {
                await userModel.findByIdAndUpdate(userId, {
                    $set: { pushNotification: { androidEndpointArn: null, androidToken: null } },
                });
            }
            if (iosEndpointArn) {
                await userModel.findByIdAndUpdate(userId, {
                    $set: { pushNotification: { iosEndpointArn: null, iosToken: null } },
                });
            }
        }
        throw err;
    }
};
