import Stripe from 'stripe';
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import * as Joi from 'joi';
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { getServiceConfig } from '../../getServiceConfig';
import { CustomError, ErrorType } from '../../customError';
import { ResponseCodes } from '../../Server/responseCodes';
import { userModel, UserModel } from '../../Models/User';
import UserTypes from '@streakoid/streakoid-sdk/lib/userTypes';

const { STRIPE_SHAREABLE_KEY, STRIPE_PLAN } = getServiceConfig();

export const stripe = new Stripe(STRIPE_SHAREABLE_KEY);

const createStripeCustomerBodySchema = {
    token: Joi.string().required(),
    id: Joi.string().required(),
};

export const createStripeCustomerSubscriptionBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        createStripeCustomerBodySchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getIsUserAnExistingStripeCustomerMiddleware = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { id } = request.body;

        const user = await userModel.findById(id);
        if (!user) {
            throw new CustomError(ErrorType.CreateStripeSubscriptionUserDoesNotExist);
        }
        if (user.type === UserTypes.premium) {
            throw new CustomError(ErrorType.CustomerIsAlreadySubscribed);
        }
        response.locals.user = user;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else {
            next(new CustomError(ErrorType.IsUserAnExistingStripeCustomerMiddleware, err));
        }
    }
};

export const isUserAnExistingStripeCustomerMiddleware = getIsUserAnExistingStripeCustomerMiddleware(userModel);

export const getCreateStripeCustomerMiddleware = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { token, id } = request.body;
        const { user } = response.locals;
        const createdStripeCustomer = await stripe.customers.create({
            source: token,
            email: user.email,
        });
        await userModel.findByIdAndUpdate(id, {
            $set: { 'stripe.customer': createdStripeCustomer.id },
        });
        response.locals.stripeCustomer = createdStripeCustomer;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateStripeCustomerMiddleware, err));
    }
};

export const createStripeCustomerMiddleware = getCreateStripeCustomerMiddleware(userModel);

export const getCreateStripeSubscriptionMiddleware = (stripePlan: string) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { stripeCustomer } = response.locals;
        const stripeSubscription = await stripe.subscriptions.create({
            customer: stripeCustomer.id,
            items: [{ plan: stripePlan }],
            expand: ['latest_invoice.payment_intent'],
        });
        response.locals.stripeSubscription = stripeSubscription;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateStripeSubscriptionMiddleware, err));
    }
};

export const createStripeSubscriptionMiddleware = getCreateStripeSubscriptionMiddleware(STRIPE_PLAN);

export const handleInitialPaymentOutcomeMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { stripeSubscription } = response.locals;
        const paymentIntentStatus = stripeSubscription.latest_invoice.payment_intent.status;
        if (stripeSubscription.status === 'active' && paymentIntentStatus === 'succeeded') {
            next();
        } else if (stripeSubscription.status === 'incomplete') {
            throw new CustomError(ErrorType.IncompletePayment);
        } else {
            throw new CustomError(ErrorType.UnknownPaymentStatus);
        }
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else {
            next(new CustomError(ErrorType.HandleInitialPaymentOutcomeMiddleware, err));
        }
    }
};

export const getAddStripeSubscriptionToUserMiddleware = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { user } = response.locals;
        const { stripeSubscription } = response.locals;
        await userModel.findByIdAndUpdate(user._id, {
            $set: { 'stripe.subscription': stripeSubscription.id },
        });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.AddStripeSubscriptionToUserMiddleware, err));
    }
};

export const addStripeSubscriptionToUserMiddleware = getAddStripeSubscriptionToUserMiddleware(userModel);

export const getSetUserTypeToPremiumMiddleware = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { user } = response.locals;
        response.locals.user = await userModel.findByIdAndUpdate(
            user._id,
            {
                $set: { type: UserTypes.premium },
            },
            { new: true },
        );
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SetUserTypeToPremiumMiddleware, err));
    }
};

export const setUserTypeToPremiumMiddleware = getSetUserTypeToPremiumMiddleware(userModel);

export const sendSuccessfulSubscriptionMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { user } = response.locals;
        response.status(ResponseCodes.created).send(user);
    } catch (err) {
        next(new CustomError(ErrorType.SendSuccessfulSubscriptionMiddleware, err));
    }
};

export const createStripeCustomerSubscriptionMiddlewares = [
    createStripeCustomerSubscriptionBodyValidationMiddleware,
    isUserAnExistingStripeCustomerMiddleware,
    createStripeCustomerMiddleware,
    createStripeSubscriptionMiddleware,
    handleInitialPaymentOutcomeMiddleware,
    addStripeSubscriptionToUserMiddleware,
    setUserTypeToPremiumMiddleware,
    sendSuccessfulSubscriptionMiddleware,
];
