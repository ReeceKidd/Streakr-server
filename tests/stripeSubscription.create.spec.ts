/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';

import { StreakoidFactory, londonTimezone } from '../src/streakoid';
import { streakoidTest } from './setup/streakoidTest';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setUpDatabase } from './setup/setUpDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { getUser } from './setup/getUser';
import PaymentPlans from '@streakoid/streakoid-models/lib/Types/PaymentPlans';
import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';
import { getServiceConfig } from '../getServiceConfig';

jest.setTimeout(120000);

const premiumUsername = 'premium';
const premiumEmail = 'premium@gmail.com';

describe('POST /stripe-subscription', () => {
    let streakoid: StreakoidFactory;

    beforeEach(async () => {
        if (isTestEnvironment()) {
            await setUpDatabase();
            streakoid = await streakoidTest();
        }
    });

    afterEach(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase();
        }
    });

    test('signs user up for monthly subscription', async () => {
        expect.assertions(15);
        const createdUser = await getUser();

        const premiumUser = await streakoid.users.create({
            username: premiumUsername,
            email: premiumEmail,
        });
        const premiumId = premiumUser._id;
        const token: any = { id: 'tok_visa', email: getServiceConfig().EMAIL };
        await streakoid.stripe.createSubscription({ token, userId: premiumId, paymentPlan: PaymentPlans.Monthly });
        const user = await streakoid.stripe.createSubscription({
            token,
            userId: createdUser._id,
            paymentPlan: PaymentPlans.Monthly,
        });
        expect(user.userType).toEqual(UserTypes.basic);
        expect(user._id).toEqual(expect.any(String));
        expect(user.username).toEqual(user.username);
        expect(user.timezone).toEqual(londonTimezone);
        expect(user.profileImages).toEqual({
            originalImageUrl: 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg',
        });
        expect(user.createdAt).toEqual(expect.any(String));
        expect(user.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(user).sort()).toEqual(
            [
                'userType',
                'isPayingMember',
                '_id',
                'username',
                'timezone',
                'profileImages',
                'pushNotification',
                'totalStreakCompletes',
                'createdAt',
                'updatedAt',
            ].sort(),
        );

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
        const createdUser = await getUser();
        const userId = createdUser._id;

        const premiumUser = await streakoid.users.create({
            username: premiumUsername,
            email: premiumEmail,
        });
        const premiumId = premiumUser._id;
        const token: any = { id: 'tok_visa', email: getServiceConfig().EMAIL };
        await streakoid.stripe.createSubscription({ token, userId: premiumId, paymentPlan: PaymentPlans.Monthly });
        const user = await streakoid.stripe.createSubscription({
            token,
            userId,
            paymentPlan: PaymentPlans.Annually,
        });
        expect(user.userType).toEqual(UserTypes.basic);
        expect(user._id).toEqual(expect.any(String));
        expect(user.timezone).toEqual(londonTimezone);
        expect(user.profileImages).toEqual({
            originalImageUrl: 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg',
        });
        expect(user.createdAt).toEqual(expect.any(String));
        expect(user.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(user).sort()).toEqual(
            [
                'userType',
                'isPayingMember',
                '_id',
                'username',
                'timezone',
                'profileImages',
                'pushNotification',
                'totalStreakCompletes',
                'createdAt',
                'updatedAt',
            ].sort(),
        );

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

    test('sends correct error when cvc check fails', async () => {
        expect.assertions(2);
        try {
            const user = await getUser();
            const userId = user._id;

            const token: any = { email: getServiceConfig().EMAIL, id: 'tok_cvcCheckFail' };
            await streakoid.stripe.createSubscription({ token, userId, paymentPlan: PaymentPlans.Monthly });
        } catch (err) {
            expect(err.response.status).toEqual(400);
            expect(err.response.data.message).toEqual("Your card's security code is incorrect.");
        }
    });

    test('sends correct error when customer has insufficient funds', async () => {
        expect.assertions(2);
        try {
            const user = await getUser();
            const userId = user._id;
            const token: any = { email: getServiceConfig().EMAIL, id: 'tok_chargeDeclinedInsufficientFunds' };
            await streakoid.stripe.createSubscription({ token, userId, paymentPlan: PaymentPlans.Monthly });
        } catch (err) {
            expect(err.response.status).toEqual(400);
            expect(err.response.data.message).toEqual('Your card has insufficient funds.');
        }
    });

    test('sends correct error when id is empty', async () => {
        expect.assertions(2);
        try {
            await getUser();
            const token: any = { id: 'tok_visa', email: getServiceConfig().EMAIL };
            await streakoid.stripe.createSubscription({ token, userId: '', paymentPlan: PaymentPlans.Monthly });
        } catch (err) {
            expect(err.response.status).toEqual(400);
            expect(err.response.data.message).toEqual(
                'child "userId" fails because ["userId" is not allowed to be empty]',
            );
        }
    });

    test('sends correct error when non Mongo ID is sent', async () => {
        expect.assertions(2);

        try {
            await getUser();
            const token: any = { id: 'tok_visa', email: getServiceConfig().EMAIL };
            await streakoid.stripe.createSubscription({
                token,
                userId: 'invalid-id',
                paymentPlan: PaymentPlans.Monthly,
            });
        } catch (err) {
            expect(err.response.status).toEqual(500);
            expect(err.response.data.code).toEqual('500-44');
        }
    });

    test('sends correct error when user does not exist', async () => {
        expect.assertions(3);

        try {
            await getUser();
            const token: any = { id: 'tok_visa', email: getServiceConfig().EMAIL };
            await streakoid.stripe.createSubscription({
                token,
                userId: '5d053a174c64143898b78455',
                paymentPlan: PaymentPlans.Monthly,
            });
        } catch (err) {
            expect(err.response.status).toEqual(400);
            expect(err.response.data.code).toEqual('400-11');
            expect(err.response.data.message).toEqual('User does not exist.');
        }
    });
});
