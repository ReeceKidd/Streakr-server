/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    stripe,
    createStripePortalSessionMiddleware,
    sendStripePortalSessionMiddleware,
    RETURN_URL,
    createStripePortalSessionMiddlewares,
} from './createStripePortalSessionMiddleware';
import { CustomError, ErrorType } from '../../customError';
import { getMockUser } from '../../testHelpers/getMockUser';

describe('createStripePortalSessionMiddlewares', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('createStripePortalSessionMiddleware', () => {
        test('sets response.locals.session to the stripe portal session.', async () => {
            expect.assertions(3);
            const user = getMockUser({ _id: 'userId' });
            stripe.billingPortal.sessions.create = jest.fn().mockResolvedValue(true);
            const request: any = {};
            const response: any = {
                locals: {
                    user,
                },
            };
            const next = jest.fn();

            await createStripePortalSessionMiddleware(request, response, next);

            expect(stripe.billingPortal.sessions.create).toBeCalledWith({
                customer: user.stripe.customer,
                return_url: RETURN_URL,
            });
            expect(response.locals.session).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('calls next with CreateStripePortalSessionMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            await createStripePortalSessionMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.CreateStripePortalSessionMiddleware));
        });
    });

    describe('sendStripePortalSessionMiddleware', () => {
        test('sends stripe portal session in response', () => {
            expect.assertions(2);
            const url = 'https://stripe.com';
            const session = {
                url,
            };

            const request: any = {};
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const response: any = {
                locals: {
                    session,
                },
                status,
            };
            const next = jest.fn();

            sendStripePortalSessionMiddleware(request, response, next);

            expect(status).toBeCalledWith(201);
            expect(send).toBeCalledWith(session);
        });

        test('calls next with SendStripePortalSessionMiddleware on middleware failure', () => {
            expect.assertions(1);
            const request: any = {};
            const response = undefined as any;
            const next = jest.fn();

            sendStripePortalSessionMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.SendStripePortalSessionMiddleware, expect.any(Error)),
            );
        });
    });

    test('are defined in the correct order', () => {
        expect.assertions(3);

        expect(createStripePortalSessionMiddlewares.length).toEqual(2);
        expect(createStripePortalSessionMiddlewares[0]).toEqual(createStripePortalSessionMiddleware);
        expect(createStripePortalSessionMiddlewares[1]).toEqual(sendStripePortalSessionMiddleware);
    });
});
