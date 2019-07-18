import { Router } from "express";
import { createStripeCustomerSubscriptionMiddlewares } from "../RouteMiddlewares/Stripe/createStripeCustomerSubscriptionMiddlewares";

const stripeRouter = Router();

stripeRouter.post(
  "/subscriptions",
  ...createStripeCustomerSubscriptionMiddlewares
);

export default stripeRouter;
