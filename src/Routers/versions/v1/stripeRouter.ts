import { Router } from 'express';
import { createStripeCustomerSubscriptionMiddlewares } from '../../../RouteMiddlewares/Stripe/createStripeCustomerSubscriptionMiddlewares';

const stripeRouter = Router();

export enum stripeRouterPaths {
    subscriptions = 'subscriptions',
    deleteSubscriptions = 'delete-subscriptions',
}

stripeRouter.post(`/${stripeRouterPaths.subscriptions}`, ...createStripeCustomerSubscriptionMiddlewares);

export { stripeRouter };
