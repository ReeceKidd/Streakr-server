import { Router } from "express";
import { createStripeCustomerSubscriptionMiddlewares } from "../RouteMiddlewares/Stripe/createStripeCustomerSubscriptionMiddlewares";
import { cancelStripeCustomerSubscriptionMiddlewares } from "../RouteMiddlewares/Stripe/cancelStripeCustomerSubscriptionMiddlewares";

const stripeRouter = Router();

export enum stripeRouterPaths {
  subscriptions = "subscriptions"
}

stripeRouter.post(
  `/${stripeRouterPaths.subscriptions}`,
  ...createStripeCustomerSubscriptionMiddlewares
);

stripeRouter.delete(
  `/${stripeRouterPaths.subscriptions}`,
  ...cancelStripeCustomerSubscriptionMiddlewares
);

export default stripeRouter;
