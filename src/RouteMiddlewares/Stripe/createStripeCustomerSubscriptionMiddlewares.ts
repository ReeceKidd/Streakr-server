import Stripe from "stripe";
import { Request, Response, NextFunction } from "express";
import { Model } from "mongoose";
import * as Joi from "joi";
import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import {
  stripeCustomerModel,
  StripeCustomer
} from "../../Models/StripeCustomer";
import { getServiceConfig } from "../../getServiceConfig";
import { CustomError, ErrorType } from "../../customError";

const { STRIPE_SHAREABLE_KEY, STRIPE_PLAN } = getServiceConfig();

export const stripe = new Stripe(STRIPE_SHAREABLE_KEY);

const createStripeCustomerBodySchema = {
  token: Joi.string().required(),
  email: Joi.string()
    .email()
    .required()
};

export const createStripeCustomerSubscriptionBodyValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  Joi.validate(
    request.body,
    createStripeCustomerBodySchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getDoesStripeCustomerExistMiddleware = (
  stripeCustomerModel: Model<StripeCustomer>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { email } = request.body;
    const stripeCustomer = await stripeCustomerModel.findOne({ email });
    response.locals.stripeCustomer = stripeCustomer;
    next();
  } catch (err) {
    next(new CustomError(ErrorType.DoesStripeCustomerExistMiddleware, err));
  }
};

export const doesStripeCustomerExistMiddleware = getDoesStripeCustomerExistMiddleware(
  stripeCustomerModel
);

export const getCreateStripeCustomerMiddleware = (
  stripeCustomerModel: Model<StripeCustomer>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { token, email } = request.body;
    const { stripeCustomer } = response.locals;
    if (!stripeCustomer) {
      const createdStripeCustomer = await stripe.customers.create({
        source: token,
        email
      });
      const newCustomer = new stripeCustomerModel({
        email,
        token,
        customerId: createdStripeCustomer.id
      });
      await newCustomer.save();
      response.locals.stripeCustomer = newCustomer;
    }
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else {
      next(new CustomError(ErrorType.CreateStripeCustomerMiddleware, err));
    }
  }
};

export const createStripeCustomerMiddleware = getCreateStripeCustomerMiddleware(
  stripeCustomerModel
);

export const createStripeSubscriptionMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { stripeCustomer } = response.locals;
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomer.customerId,
      items: [{ plan: STRIPE_PLAN }],
      expand: ["latest_invoice.payment_intent"]
    });
    response.locals.subscription = subscription;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else {
      next(new CustomError(ErrorType.CreateStripeSubscriptionMiddleware, err));
    }
  }
};

export const handleInitialPaymentOutcomeMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { subscription } = response.locals;
    const subscriptionStatus = subscription.status;
    const paymentIntentStatus =
      subscription.latest_invoice.payment_intent.status;
    if (
      subscriptionStatus === "active" &&
      paymentIntentStatus === "succeeded"
    ) {
      next();
    } else if (status === "incomplete") {
      throw new CustomError(ErrorType.IncompletePayment, paymentIntentStatus);
    } else throw new CustomError(ErrorType.UnknownPaymentStatus);
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else {
      next(new CustomError(ErrorType.HandleInitialPaymentOutcomeMiddleware));
    }
  }
};

export const sendSuccessfulSubscriptionMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { stripeCustomer, subscription } = response.locals;
    response.send({ stripeCustomer, subscription });
  } catch (err) {
    next(new CustomError(ErrorType.SendSuccessfulSubscriptionMiddleware));
  }
};

export const createStripeCustomerSubscriptionMiddlewares = [
  createStripeCustomerSubscriptionBodyValidationMiddleware,
  doesStripeCustomerExistMiddleware,
  createStripeCustomerMiddleware,
  createStripeSubscriptionMiddleware,
  handleInitialPaymentOutcomeMiddleware,
  sendSuccessfulSubscriptionMiddleware
];
