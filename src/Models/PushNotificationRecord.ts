import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { PushNotificationRecord } from '@streakoid/streakoid-models/lib/Models/PushNotificationRecord';
import PushNotificationTypes from '@streakoid/streakoid-models/lib/Types/PushNotificationTypes';

export type PushNotificationRecordModel = PushNotificationRecord & mongoose.Document;

export const pushNotificationRecordSchema = new mongoose.Schema(
    {
        userId: {
            required: true,
            type: String,
        },
        pushNotificationType: {
            required: true,
            type: PushNotificationTypes,
        },
        title: {
            required: true,
            type: String,
        },
        body: {
            required: true,
            type: String,
        },
        androidEndpointArn: {
            type: String,
        },
        iosEndpointArn: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: Collections.PushNotificationRecords,
    },
);

export const pushNotificationRecordModel: mongoose.Model<PushNotificationRecordModel> = mongoose.model<
    PushNotificationRecordModel
>(Models.PushNotificationRecord, pushNotificationRecordSchema);
