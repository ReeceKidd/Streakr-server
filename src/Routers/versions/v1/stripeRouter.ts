import { Router } from 'express';
import { createStripeCustomerSubscriptionMiddlewares } from '../../../RouteMiddlewares/Stripe/createStripeCustomerSubscriptionMiddlewares';
import { authenticationMiddlewares } from '../../../../src/SharedMiddleware/authenticationMiddlewares';

const stripeRouter = Router();

export enum stripeRouterPaths {
    subscriptions = 'subscriptions',
    deleteSubscriptions = 'delete-subscriptions',
}

stripeRouter.use(...authenticationMiddlewares);

stripeRouter.post(`/${stripeRouterPaths.subscriptions}`, ...createStripeCustomerSubscriptionMiddlewares);

export { stripeRouter };
