/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createStripeCustomerSubscriptionMiddlewares,
    createStripeCustomerSubscriptionBodyValidationMiddleware,
    createStripeCustomerMiddleware,
    createStripeSubscriptionMiddleware,
    handleInitialPaymentOutcomeMiddleware,
    sendSuccessfulSubscriptionMiddleware,
    stripe,
    getCreateStripeCustomerMiddleware,
    getCreateStripeSubscriptionMiddleware,
    isUserAnExistingStripeCustomerMiddleware,
    getIsUserAnExistingStripeCustomerMiddleware,
    addStripeSubscriptionToUserMiddleware,
    getAddStripeSubscriptionToUserMiddleware,
    setUserTypeToPremiumMiddleware,
    getSetUserTypeToPremiumMiddleware,
} from './createStripeCustomerSubscriptionMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import UserTypes from '@streakoid/streakoid-sdk/lib/userTypes';

describe('createStripeCustomerSubscriptionMiddlewares', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('createStripeCustomerSubscriptionBodyValidationMiddleware', () => {
        const token = '1234';
        const id = 'id';

        test('sends correct error response when unsupported key is sent', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { unsupportedKey: 1234, token, id },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createStripeCustomerSubscriptionBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(400);
            expect(send).toBeCalledWith({
                message: '"unsupportedKey" is not allowed',
            });
            expect(next).not.toBeCalled();
        });

        test('sends correct error response when token is not defined', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { id },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createStripeCustomerSubscriptionBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "token" fails because ["token" is required]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends correct error response when id is not defined', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { token },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createStripeCustomerSubscriptionBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "id" fails because ["id" is required]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends correct error response when id is not a string', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { token, id: 1234 },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createStripeCustomerSubscriptionBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "id" fails because ["id" must be a string]',
            });
            expect(next).not.toBeCalled();
        });
    });

    describe('isUserAnExistingStripeCustomerMiddleware', () => {
        test('calls next if user exists and is not premium already', async () => {
            expect.assertions(2);
            const id = 'id';
            const findById = jest.fn().mockResolvedValue({ type: 'basic' });
            const userModel: any = {
                findById,
            };
            const request: any = {
                body: {
                    id,
                },
            };
            const response: any = {
                locals: {},
            };
            const next = jest.fn();
            const isUserAnExistingStripeCustomerMiddleware = getIsUserAnExistingStripeCustomerMiddleware(userModel);

            await isUserAnExistingStripeCustomerMiddleware(request, response, next);

            expect(findById).toBeCalledWith(id);
            expect(next).toBeCalledWith();
        });

        test("calls next with StripeSubscriptionUserDoesNotExist error if user doesn't exist", async () => {
            expect.assertions(1);
            const id = 'id';
            const findById = jest.fn().mockResolvedValue(false);
            const userModel: any = {
                findById,
            };
            const request: any = {
                body: {
                    id,
                },
            };
            const response: any = {
                locals: {},
            };
            const next = jest.fn();
            const isUserAnExistingStripeCustomerMiddleware = getIsUserAnExistingStripeCustomerMiddleware(userModel);

            await isUserAnExistingStripeCustomerMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.CreateStripeSubscriptionUserDoesNotExist));
        });

        test('calls next with CustomerIsAlreadySubscribed error if user type is set to premium', async () => {
            expect.assertions(1);
            const findById = jest.fn().mockResolvedValue({
                type: UserTypes.premium,
            });
            const userModel: any = {
                findById,
            };
            const id = '123';
            const request: any = {
                body: {
                    id,
                },
            };
            const response: any = {
                locals: {},
            };
            const next = jest.fn();
            const isUserAnExistingStripeCustomerMiddleware = getIsUserAnExistingStripeCustomerMiddleware(userModel);

            await isUserAnExistingStripeCustomerMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.CustomerIsAlreadySubscribed));
        });

        test('calls next with IsUserAnExistingStripeCustomerMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const id = 'id';
            const userModel: any = {};
            const request: any = {
                body: {
                    id,
                },
            };
            const response: any = {
                locals: {},
            };
            const next = jest.fn();
            const isUserAnExistingStripeCustomerMiddleware = getIsUserAnExistingStripeCustomerMiddleware(userModel);

            await isUserAnExistingStripeCustomerMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.IsUserAnExistingStripeCustomerMiddleware, expect.any(Error)),
            );
        });
    });

    describe('createStripeCustomerMiddleware', () => {
        test('creates stripe customer and sets response.locals.customer', async () => {
            expect.assertions(4);
            const token = 'token';
            const id = 'id';
            const email = 'test@gmail.com';
            const user = {
                email,
            };
            const customerId = '123';
            stripe.customers.create = jest.fn().mockResolvedValue({ id: customerId });
            const findByIdAndUpdate = jest.fn().mockResolvedValue({});
            const userModel = {
                findByIdAndUpdate,
            };
            const request: any = {
                body: {
                    token,
                    id,
                },
            };
            const response: any = {
                locals: {
                    user,
                },
            };
            const next = jest.fn();
            const createStripeCustomerMiddleware = getCreateStripeCustomerMiddleware(userModel as any);

            await createStripeCustomerMiddleware(request, response, next);

            expect(stripe.customers.create).toBeCalledWith({ source: token, email });
            expect(findByIdAndUpdate).toBeCalledWith(id, {
                $set: { 'stripe.customer': customerId },
            });
            expect(response.locals.stripeCustomer).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('calls next with CreateStripeCustomerMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const createStripeCustomerMiddleware = getCreateStripeCustomerMiddleware({} as any);

            await createStripeCustomerMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.CreateStripeCustomerMiddleware, expect.any(Error)));
        });
    });

    describe('createStripeSubscriptionMiddleware', () => {
        test('creates stripe subscription for correct plan', async () => {
            expect.assertions(3);
            const stripeCustomer = {
                id: '123',
            };
            stripe.subscriptions.create = jest.fn().mockResolvedValue({});
            const stripePlan = 'stripePlan';
            const request: any = {};
            const response: any = {
                locals: {
                    stripeCustomer,
                },
            };
            const next = jest.fn();
            const createStripeSubscriptionMiddleware = getCreateStripeSubscriptionMiddleware(stripePlan);

            await createStripeSubscriptionMiddleware(request, response, next);

            expect(stripe.subscriptions.create).toBeCalledWith({
                customer: stripeCustomer.id,
                items: [{ plan: stripePlan }],
                expand: ['latest_invoice.payment_intent'],
            });
            expect(response.locals.stripeSubscription).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('calls next with CreateStripeSubscriptionMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const createStripeSubscriptionMiddleware = getCreateStripeSubscriptionMiddleware('test');

            await createStripeSubscriptionMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.CreateStripeSubscriptionMiddleware));
        });
    });

    describe('handleInitialPaymentOutcomeMiddleware', () => {
        test(' calls next() if subscriptionStatus is active and paymentIntentStatus succeeded', () => {
            expect.assertions(1);
            const stripeSubscription = {
                status: 'active',
                latest_invoice: {
                    payment_intent: {
                        status: 'succeeded',
                    },
                },
            };
            const request: any = {};
            const response: any = {
                locals: { stripeSubscription },
            };
            const next = jest.fn();

            handleInitialPaymentOutcomeMiddleware(request, response, next);

            expect(next).toBeCalledWith();
        });

        test('calls next with IncompletePayment error when status is incomplete', () => {
            expect.assertions(1);
            const incompleteSubscription = {
                status: 'incomplete',
                latest_invoice: {
                    payment_intent: {
                        status: 'incomplete',
                    },
                },
            };
            const request: any = {};
            const response: any = {
                locals: { stripeSubscription: incompleteSubscription },
            };
            const next = jest.fn();

            handleInitialPaymentOutcomeMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.IncompletePayment, expect.any(Error)));
        });

        test('calls next with UnknownPaymentStatus for all other payment issues', () => {
            expect.assertions(1);
            const subscription = {
                status: undefined,
                latest_invoice: {
                    payment_intent: {
                        status: 'unknown',
                    },
                },
            };
            const request: any = {};
            const response: any = {
                locals: { stripeSubscription: subscription },
            };
            const next = jest.fn();

            handleInitialPaymentOutcomeMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.UnknownPaymentStatus, expect.any(Error)));
        });

        test('calls next with HandleInitialPaymentOutcomeMiddleware on middleware failure', () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {
                locals: {},
            };
            const next = jest.fn();

            handleInitialPaymentOutcomeMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.HandleInitialPaymentOutcomeMiddleware, expect.any(Error)),
            );
        });
    });

    describe('addStripeSubscriptionToUserMiddleware', () => {
        test('updates user model with stripe subscription', async () => {
            expect.assertions(2);
            const user = {
                _id: '123',
            };
            const stripeSubscription = {
                id: 'abc',
            };
            const request: any = {};
            const response: any = {
                locals: {
                    user,
                    stripeSubscription,
                },
            };
            const next = jest.fn();
            const findByIdAndUpdate = jest.fn().mockResolvedValue(true);
            const userModel = {
                findByIdAndUpdate,
            };
            const addStripeSubscriptionToUserMiddleware = getAddStripeSubscriptionToUserMiddleware(userModel as any);

            await addStripeSubscriptionToUserMiddleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(user._id, {
                $set: { 'stripe.subscription': stripeSubscription.id },
            });
            expect(next).toBeCalledWith();
        });

        test('calls next with AddStripeSubscriptionToUserMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const userModel: any = {};
            const addStripeSubscriptionToUserMiddleware = getAddStripeSubscriptionToUserMiddleware(userModel);

            await addStripeSubscriptionToUserMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.AddStripeSubscriptionToUserMiddleware, expect.any(Error)),
            );
        });
    });

    describe('setUserTypeToPremiumMiddleware', () => {
        test('updates user model type to be premium', async () => {
            expect.assertions(2);
            const user = {
                _id: '123',
            };
            const request: any = {};
            const response: any = {
                locals: {
                    user,
                },
            };
            const next = jest.fn();
            const findByIdAndUpdate = jest.fn().mockResolvedValue(true);
            const userModel = {
                findByIdAndUpdate,
            };
            const setUserTypeToPremiumMiddleware = getSetUserTypeToPremiumMiddleware(userModel as any);

            await setUserTypeToPremiumMiddleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                user._id,
                {
                    $set: { type: 'premium' },
                },
                { new: true },
            );
            expect(next).toBeCalledWith();
        });

        test('calls next with SetUserTypeToPremiumMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const userModel: any = {};
            const setUserTypeToPremiumMiddleware = getSetUserTypeToPremiumMiddleware(userModel);

            await setUserTypeToPremiumMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.SetUserTypeToPremiumMiddleware, expect.any(Error)));
        });
    });

    describe('sendSuccessfulSubscriptionMiddleware', () => {
        test('sends customer and subscription information in response', () => {
            expect.assertions(2);
            const request: any = {};
            const user = {
                id: 'abc',
                stripe: { customer: 'customer', subscription: 'subscription' },
                type: 'type',
            };
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const response: any = {
                locals: {
                    user,
                },
                status,
            };
            const next = jest.fn();

            sendSuccessfulSubscriptionMiddleware(request, response, next);

            expect(status).toBeCalledWith(201);
            expect(send).toBeCalledWith(user);
        });

        test('calls next with SendSuccessfulSubscriptionMiddleware on middleware failure', () => {
            expect.assertions(1);
            const request: any = {};
            const response = undefined as any;
            const next = jest.fn();

            sendSuccessfulSubscriptionMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.SendSuccessfulSubscriptionMiddleware, expect.any(Error)),
            );
        });
    });

    test('are defined in the correct order', () => {
        expect.assertions(9);

        expect(createStripeCustomerSubscriptionMiddlewares.length).toEqual(8);
        expect(createStripeCustomerSubscriptionMiddlewares[0]).toBe(
            createStripeCustomerSubscriptionBodyValidationMiddleware,
        );
        expect(createStripeCustomerSubscriptionMiddlewares[1]).toBe(isUserAnExistingStripeCustomerMiddleware);
        expect(createStripeCustomerSubscriptionMiddlewares[2]).toBe(createStripeCustomerMiddleware);
        expect(createStripeCustomerSubscriptionMiddlewares[3]).toBe(createStripeSubscriptionMiddleware);
        expect(createStripeCustomerSubscriptionMiddlewares[4]).toBe(handleInitialPaymentOutcomeMiddleware);
        expect(createStripeCustomerSubscriptionMiddlewares[5]).toBe(addStripeSubscriptionToUserMiddleware);
        expect(createStripeCustomerSubscriptionMiddlewares[6]).toBe(setUserTypeToPremiumMiddleware);
        expect(createStripeCustomerSubscriptionMiddlewares[7]).toBe(sendSuccessfulSubscriptionMiddleware);
    });
});
