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

const { STRIPE_SHAREABLE_KEY, STRIPE_PRODUCT } = getServiceConfig();

const stripe = new Stripe(STRIPE_SHAREABLE_KEY);

const createStripeCustomerBodySchema = {
  token: Joi.string().required(),
  email: Joi.string()
    .email()
    .required()
};

export const createStripeCustomerBodyValidationMiddleware = (
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
  } catch (error) {
    next(error);
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
      const stripeCustomer = await stripe.customers.create({
        source: token,
        email
      });
      const newCustomer = new stripeCustomerModel({
        email,
        token,
        customerId: stripeCustomer.id
      });
      await newCustomer.save();
      response.locals.stripeCustomer = newCustomer;
    }
    next();
  } catch (error) {
    next(error);
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
    await stripe.subscriptions.create({
      customer: stripeCustomer,
      items: [{ plan: STRIPE_PRODUCT }]
    });
  } catch (err) {
    next(err);
  }
};

export const sendCreatedStripeCustomerSuccessMessageMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { stripeCustomer } = response.locals;
    response.send({ stripeCustomer });
  } catch (error) {
    next(error);
  }
};

export const createStripeCustomerMiddlewares = [
  createStripeCustomerBodyValidationMiddleware,
  doesStripeCustomerExistMiddleware,
  createStripeCustomerMiddleware,
  sendCreatedStripeCustomerSuccessMessageMiddleware
];
