import Stripe from 'stripe';
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import * as Joi from 'joi';
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { getServiceConfig } from '../../getServiceConfig';
import { CustomError, ErrorType } from '../../customError';
import { ResponseCodes } from '../../Server/responseCodes';
import { userModel, UserModel } from '../../Models/User';
import { FormattedUser, User } from '@streakoid/streakoid-sdk/lib';

const { STRIPE_SECRET_KEY, STRIPE_PLAN } = getServiceConfig();

export const stripe = new Stripe(STRIPE_SECRET_KEY);

const createStripeCustomerBodySchema = {
    token: Joi.object().required(),
    userId: Joi.string().required(),
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
        const { userId } = request.body;

        const user = await userModel.findById(userId);
        if (!user) {
            throw new CustomError(ErrorType.CreateStripeSubscriptionUserDoesNotExist);
        }
        if (user.membershipInformation.isPayingMember) {
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

export const validateStripeTokenMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { token } = request.body;
        if (!token.id) {
            throw new CustomError(ErrorType.StripeTokenMissingId);
        }
        if (!token.email) {
            throw new CustomError(ErrorType.StripeTokenMissingEmail);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else {
            next(new CustomError(ErrorType.ValidateStripeTokenMiddlware, err));
        }
    }
};

export const createStripeCustomerMiddleware = async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        try {
            const { token } = request.body;
            const stripeCustomer = await stripe.customers.create({
                source: token.id,
                email: token.email,
            });
            response.locals.stripeCustomer = stripeCustomer;
            next();
        } catch (err) {
            response.status(ResponseCodes.badRequest).send(err);
            return;
        }
    } catch (err) {
        next(new CustomError(ErrorType.CreateStripeCustomerMiddleware, err));
    }
};

export const getUpdateUserStripeCustomerIdMiddleware = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId } = request.body;
        const { stripeCustomer } = response.locals;
        await userModel.findByIdAndUpdate(userId, {
            $set: { 'stripe.customer': stripeCustomer.id },
        });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateStripeCustomerMiddleware, err));
    }
};

export const updateUserStripeCustomerIdMiddleware = getUpdateUserStripeCustomerIdMiddleware(userModel);

export const getCreateStripeSubscriptionMiddleware = (stripePlan: string) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { stripeCustomer } = response.locals;
        try {
            const stripeSubscription = await stripe.subscriptions.create({
                customer: stripeCustomer.id,
                items: [{ plan: stripePlan }],
                expand: ['latest_invoice.payment_intent'],
                // eslint-disable-next-line @typescript-eslint/camelcase
                trial_period_days: 14,
            });

            response.locals.stripeSubscription = stripeSubscription;
            next();
        } catch (err) {
            response.status(ResponseCodes.badRequest).send(err);
            return;
        }
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
        if (stripeSubscription.status === 'trialing') {
            return next();
        }
        if (stripeSubscription.status === 'incomplete') {
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

export const getUpdateUserMembershipInformationMiddleware = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { user } = response.locals;
        response.locals.user = await userModel
            .findByIdAndUpdate(
                user._id,
                {
                    $set: {
                        membershipInformation: {
                            ...user.membershipInformation,
                            isPayingMember: true,
                            currentMembershipStartDate: new Date(),
                        },
                    },
                },
                { new: true },
            )
            .lean();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.UpdateUserMembershipInformationMiddleware, err));
    }
};

export const updateUserMembershipInformationMiddleware = getUpdateUserMembershipInformationMiddleware(userModel);

export const formatUserMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const user: User = response.locals.user;
        const formattedUser: FormattedUser = {
            _id: user._id,
            username: user.username,
            isPayingMember: user.membershipInformation.isPayingMember,
            userType: user.userType,
            timezone: user.timezone,
            friends: user.friends,
            badges: user.badges,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            profileImages: user.profileImages,
            pushNotificationToken: user.pushNotificationToken,
        };
        response.locals.user = formattedUser;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateStripeSubscriptionFormatUserMiddleware, err));
    }
};

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
    validateStripeTokenMiddleware,
    createStripeCustomerMiddleware,
    updateUserStripeCustomerIdMiddleware,
    createStripeSubscriptionMiddleware,
    handleInitialPaymentOutcomeMiddleware,
    addStripeSubscriptionToUserMiddleware,
    updateUserMembershipInformationMiddleware,
    formatUserMiddleware,
    sendSuccessfulSubscriptionMiddleware,
];
