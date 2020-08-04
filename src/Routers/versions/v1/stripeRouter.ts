import { Router } from 'express';
import { createStripeCustomerSubscriptionMiddlewares } from '../../../RouteMiddlewares/Stripe/createStripeCustomerSubscriptionMiddlewares';
import { authenticationMiddlewares } from '../../../../src/SharedMiddleware/authenticationMiddlewares';
import { createStripePortalSessionMiddlewares } from '../../../RouteMiddlewares/Stripe/createStripePortalSessionMiddleware';

const stripeRouter = Router();

export enum stripeRouterPaths {
    subscriptions = 'subscriptions',
    portalSession = 'portal-session',
    deleteSubscriptions = 'delete-subscriptions',
}

stripeRouter.use(...authenticationMiddlewares);

stripeRouter.post(`/${stripeRouterPaths.subscriptions}`, ...createStripeCustomerSubscriptionMiddlewares);

stripeRouter.post(`/${stripeRouterPaths.portalSession}`, ...createStripePortalSessionMiddlewares);

export { stripeRouter };
