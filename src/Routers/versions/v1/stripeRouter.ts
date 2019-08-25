import { Router } from "express";
import { createStripeCustomerSubscriptionMiddlewares } from "../../../RouteMiddlewares/Stripe/createStripeCustomerSubscriptionMiddlewares";
import { cancelStripeCustomerSubscriptionMiddlewares } from "../../../RouteMiddlewares/Stripe/cancelStripeCustomerSubscriptionMiddlewares";

const stripeRouter = Router();

export enum stripeRouterPaths {
  subscriptions = "subscriptions",
  deleteSubscriptions = "delete-subscriptions"
}

stripeRouter.post(
  `/${stripeRouterPaths.subscriptions}`,
  ...createStripeCustomerSubscriptionMiddlewares
);

stripeRouter.post(
  `/${stripeRouterPaths.deleteSubscriptions}`,
  ...cancelStripeCustomerSubscriptionMiddlewares
);

export default stripeRouter;
