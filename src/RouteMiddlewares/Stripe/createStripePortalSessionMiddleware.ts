import Stripe from 'stripe';
import { Request, Response, NextFunction } from 'express';
import { getServiceConfig } from '../../getServiceConfig';
import { CustomError, ErrorType } from '../../customError';
import { ResponseCodes } from '../../Server/responseCodes';
import { User } from '@streakoid/streakoid-models/lib/Models/User';

const { STRIPE_SECRET_KEY } = getServiceConfig();

export const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2020-03-02' });
export const RETURN_URL = 'https://streakoid.com/account';

export const createStripePortalSessionMiddleware = async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const session = await stripe.billingPortal.sessions.create({
            customer: user.stripe.customer,
            // eslint-disable-next-line @typescript-eslint/camelcase
            return_url: RETURN_URL,
        });
        response.locals.session = session;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateStripePortalSessionMiddleware, err));
    }
};

export const sendStripePortalSessionMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { session } = response.locals;
        response.status(ResponseCodes.created).send(session);
    } catch (err) {
        next(new CustomError(ErrorType.SendStripePortalSessionMiddleware, err));
    }
};

export const createStripePortalSessionMiddlewares = [
    createStripePortalSessionMiddleware,
    sendStripePortalSessionMiddleware,
];
