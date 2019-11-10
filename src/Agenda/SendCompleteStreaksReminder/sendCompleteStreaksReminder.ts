/* eslint-disable @typescript-eslint/explicit-function-return-type */

import Expo, { ExpoPushMessage } from 'expo-server-sdk';

import { userModel } from '../../Models/User';
import { User } from '@streakoid/streakoid-sdk/lib';

export const sendCompleteStreakReminders = async ({ timezone, hour }: { timezone: string; hour: number }) => {
    const usersWhoWantPushNotificationReminder: User[] = await userModel
        .find({
            timezone,
            'notifications.completeStreaksReminder.pushNotification': true,
            'notifications.completeStreaksReminder.reminderTime': hour,
            pushNotificationToken: { $exists: true },
        })
        .lean();
    const messages: ExpoPushMessage[] = [];
    usersWhoWantPushNotificationReminder.map(user => {
        messages.push({
            to: user.pushNotificationToken,
            sound: 'default',
            title: 'Complete your streaks',
            body: 'Click complete before Oid finds out',
        });
    });
    const expo = new Expo();
    const chunks = expo.chunkPushNotifications(messages);
    return Promise.all(
        chunks.map(async chunk => {
            await expo.sendPushNotificationsAsync(chunk);
        }),
    );
};
