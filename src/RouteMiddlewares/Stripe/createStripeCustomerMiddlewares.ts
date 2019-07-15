import Stripe from "stripe";
import { Request, Response, NextFunction } from "express";
// Import strip key as environment variable.
const stripe = new Stripe("sk_test_Es9O69gLTpu8QF1lNTw0dMub00ZpeC5AyH");
import * as Joi from "joi";
import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";

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

export const createStripeCustomerMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { token, email } = request.body;
    const customer = await stripe.customers.create({
      source: token,
      email
    });
    console.log(customer);
    response.locals.customer = customer;
    next();
  } catch (error) {
    return response.send(error);
  }
};

export const saveStripeCustomerMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    console.log("save");
  } catch (error) {
    return response.send(error);
  }
};

export const sendCreatedStripeCustomerSuccessMessageMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    response.send("success");
  } catch (error) {
    return response.send(error);
  }
};

export const createStripeCustomerMiddlewares = [
  createStripeCustomerBodyValidationMiddleware,
  createStripeCustomerMiddleware,
  saveStripeCustomerMiddleware,
  sendCreatedStripeCustomerSuccessMessageMiddleware
];
