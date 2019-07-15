import { Router } from "express";
import { createStripeCustomerMiddlewares } from "../RouteMiddlewares/Stripe/createStripeCustomerMiddlewares";

const stripeRouter = Router();

stripeRouter.post("/customers", ...createStripeCustomerMiddlewares);

export default stripeRouter;
