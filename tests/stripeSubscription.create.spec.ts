/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Mongoose } from 'mongoose';

import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import PaymentPlans from '@streakoid/streakoid-models/lib/Types/PaymentPlans';
import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { getUser } from './setup/getUser';
import { correctFormattedUserKeys } from '../src/testHelpers/correctFormattedUserKeys';

jest.setTimeout(120000);

const testName = 'POST-stripe-subscription';

describe(testName, () => {
    let database: Mongoose;
    let SDK: StreakoidSDK;
    beforeAll(async () => {
        if (isTestEnvironment()) {
            database = await setupDatabase({ testName });
            SDK = streakoidTestSDK({ testName });
        }
    });

    afterEach(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase({ database });
        }
    });

    afterAll(async () => {
        if (isTestEnvironment()) {
            await disconnectDatabase({ database });
        }
    });

    test('signs user up for monthly subscription', async () => {
        expect.assertions(15);
        const createdUser = await getUser({ testName });
        const premiumUsername = 'premium';
        const premiumEmail = 'premium@gmail.com';

        const premiumUser = await SDK.users.create({
            username: premiumUsername,
            email: premiumEmail,
        });
        const premiumId = premiumUser._id;
        const token: any = { id: 'tok_visa', email: premiumEmail };
        await SDK.stripe.createSubscription({ token, userId: premiumId, paymentPlan: PaymentPlans.Monthly });
        const user = await SDK.stripe.createSubscription({
            token,
            userId: createdUser._id,
            paymentPlan: PaymentPlans.Monthly,
        });
        expect(user.userType).toEqual(UserTypes.temporary);
        expect(user._id).toEqual(expect.any(String));
        expect(user.username).toEqual(user.username);
        expect(user.timezone).toBeDefined();
        expect(user.profileImages).toEqual({
            originalImageUrl: 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg',
        });
        expect(user.createdAt).toEqual(expect.any(String));
        expect(user.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(user).sort()).toEqual(correctFormattedUserKeys);

        const databaseUser = await mongoose.connection.db.collection('Users').findOne({ username: user.username });
        expect(Object.keys(databaseUser.stripe)).toEqual(['customer', 'subscription']);
        expect(databaseUser.stripe.subscription).toEqual(expect.any(String));
        expect(databaseUser.stripe.customer).toEqual(expect.any(String));
        expect(databaseUser.membershipInformation.isPayingMember).toEqual(true);
        expect(databaseUser.membershipInformation.currentMembershipStartDate).toBeDefined();
        expect(databaseUser.membershipInformation.pastMemberships).toEqual([]);
        expect(Object.keys(databaseUser.membershipInformation)).toEqual([
            'isPayingMember',
            'currentMembershipStartDate',
            'pastMemberships',
        ]);
    });

    test('signs user up for annual subscription', async () => {
        expect.assertions(14);
        const premiumUsername = 'premium';
        const premiumEmail = 'premium@gmail.com';
        const createdUser = await getUser({ testName });
        const userId = createdUser._id;

        const premiumUser = await SDK.users.create({
            username: premiumUsername,
            email: premiumEmail,
        });
        const premiumId = premiumUser._id;
        const token: any = { id: 'tok_visa', email: premiumEmail };
        await SDK.stripe.createSubscription({ token, userId: premiumId, paymentPlan: PaymentPlans.Monthly });
        const user = await SDK.stripe.createSubscription({
            token,
            userId,
            paymentPlan: PaymentPlans.Annually,
        });
        expect(user.userType).toEqual(UserTypes.temporary);
        expect(user._id).toEqual(expect.any(String));
        expect(user.timezone).toBeDefined();
        expect(user.profileImages).toEqual({
            originalImageUrl: 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg',
        });
        expect(user.createdAt).toEqual(expect.any(String));
        expect(user.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(user).sort()).toEqual(correctFormattedUserKeys);

        const databaseUser = await mongoose.connection.db.collection('Users').findOne({ username: user.username });
        expect(Object.keys(databaseUser.stripe)).toEqual(['customer', 'subscription']);
        expect(databaseUser.stripe.subscription).toEqual(expect.any(String));
        expect(databaseUser.stripe.customer).toEqual(expect.any(String));
        expect(databaseUser.membershipInformation.isPayingMember).toEqual(true);
        expect(databaseUser.membershipInformation.currentMembershipStartDate).toBeDefined();
        expect(databaseUser.membershipInformation.pastMemberships).toEqual([]);
        expect(Object.keys(databaseUser.membershipInformation)).toEqual([
            'isPayingMember',
            'currentMembershipStartDate',
            'pastMemberships',
        ]);
    });

    test('sends correct error when id is empty', async () => {
        expect.assertions(2);
        try {
            await getUser({ testName });
            const email = 'test@gmail.com';
            const token: any = { id: 'tok_visa', email };
            await SDK.stripe.createSubscription({ token, userId: '', paymentPlan: PaymentPlans.Monthly });
        } catch (err) {
            const error = JSON.parse(err.text);
            const { message } = error;
            expect(err.status).toEqual(400);
            expect(message).toEqual('child "userId" fails because ["userId" is not allowed to be empty]');
        }
    });

    test('sends correct error when non Mongo ID is sent', async () => {
        expect.assertions(2);

        try {
            await getUser({ testName });
            const email = 'test@gmail.com';
            const token: any = { id: 'tok_visa', email };
            await SDK.stripe.createSubscription({
                token,
                userId: 'invalid-id',
                paymentPlan: PaymentPlans.Monthly,
            });
        } catch (err) {
            const error = JSON.parse(err.text);
            const { code } = error;
            expect(err.status).toEqual(500);
            expect(code).toEqual('500-44');
        }
    });

    test('sends correct error when user does not exist', async () => {
        expect.assertions(3);

        try {
            await getUser({ testName });
            const email = 'test@gmail.com';
            const token: any = { id: 'tok_visa', email };
            await SDK.stripe.createSubscription({
                token,
                userId: '5d053a174c64143898b78455',
                paymentPlan: PaymentPlans.Monthly,
            });
        } catch (err) {
            const error = JSON.parse(err.text);
            const { message, code } = error;
            expect(err.status).toEqual(400);
            expect(code).toEqual('400-11');
            expect(message).toEqual('User does not exist.');
        }
    });
});
