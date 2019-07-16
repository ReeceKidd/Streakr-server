import Stripe from "stripe";
import { Request, Response, NextFunction } from "express";
// Import strip key as environment variable.
const stripe = new Stripe("sk_test_Es9O69gLTpu8QF1lNTw0dMub00ZpeC5AyH");
import * as Joi from "joi";
import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import {
  stripeCustomerModel,
  StripeCustomer
} from "../../Models/StripeCustomer";
import { Model } from "mongoose";

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
    const existingStripeCustomer = await stripeCustomerModel.findOne({ email });
    console.log(existingStripeCustomer);
    response.locals.existingStripeCustomer = existingStripeCustomer;
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
    const { existingStripeCustomer } = response.locals;
    if (!existingStripeCustomer) {
      await stripe.customers.create({
        source: token,
        email
      });
      const customer = new stripeCustomerModel({ email, token });
      await customer.save();
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const createStripeCustomerMiddleware = getCreateStripeCustomerMiddleware(
  stripeCustomerModel
);

export const sendCreatedStripeCustomerSuccessMessageMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    response.send("success");
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
