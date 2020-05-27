import PaymentPlans from '@streakoid/streakoid-models/lib/Types/PaymentPlans';
import { stripe as stripeImport } from './stripe';

describe('SDK stripe', () => {
    const postRequest = jest.fn().mockResolvedValue(true);
    const stripe = stripeImport({
        postRequest,
    });

    describe('createSubscription', () => {
        test('calls POST with correct URL and  properties', async () => {
            expect.assertions(1);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const token: any = 'token';
            const userId = 'id';
            const paymentPlan = PaymentPlans.Annually;

            await stripe.createSubscription({ token, userId, paymentPlan });

            expect(postRequest).toBeCalledWith({
                route: `/v1/stripe/subscriptions`,
                params: {
                    token,
                    userId,
                    paymentPlan,
                },
            });
        });
    });
});
