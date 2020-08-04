/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mongoose } from 'mongoose';

import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import PaymentPlans from '@streakoid/streakoid-models/lib/Types/PaymentPlans';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { getUser } from './setup/getUser';
import { getPayingUser } from './setup/getPayingUser';

jest.setTimeout(120000);

const testName = 'POST-stripe-portal-session';

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

    test('creates a stripe portal session', async () => {
        expect.assertions(2);
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
        await SDK.stripe.createSubscription({
            token,
            userId: createdUser._id,
            paymentPlan: PaymentPlans.Monthly,
        });
        const stripePortalSession = await SDK.stripe.createPortalSession();

        expect(stripePortalSession.url).toEqual(expect.any(String));
        expect(stripePortalSession.return_url).toEqual(expect.any(String));
    });

    test('if user is not a stripe customer it throws an error', async () => {
        expect.assertions(2);

        await getPayingUser({ testName });

        try {
            await SDK.stripe.createPortalSession();
        } catch (err) {
            const error = JSON.parse(err.text);
            const { message } = error;
            expect(err.status).toEqual(400);
            expect(message).toEqual(`User is not a stripe customer.`);
        }
    });
});
