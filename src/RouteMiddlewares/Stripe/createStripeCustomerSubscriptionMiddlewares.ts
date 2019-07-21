import Stripe from "stripe";
import { Request, Response, NextFunction } from "express";
import { Model } from "mongoose";
import * as Joi from "joi";
import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { getServiceConfig } from "../../getServiceConfig";
import { CustomError, ErrorType } from "../../customError";
import { ResponseCodes } from "../../Server/responseCodes";
import { userModel, User, UserTypes } from "../../Models/User";

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

export const getIsUserAnExistingStripeCustomerMiddleware = (
  userModel: Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { email } = request.body;
    const user = (await userModel.findOne({ email })) as User;
    if (!user) {
      throw new CustomError(ErrorType.StripeSubscriptionUserDoesNotExist);
    }
    if (user.type === UserTypes.premium) {
      throw new CustomError(ErrorType.CustomerIsAlreadySubscribed);
    }
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else
      next(
        new CustomError(ErrorType.IsUserAnExistingStripeCustomerMiddleware, err)
      );
  }
};

export const isUserAnExistingStripeCustomerMiddleware = getIsUserAnExistingStripeCustomerMiddleware(
  userModel
);

export const getCreateStripeCustomerMiddleware = (
  userModel: Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { token, email } = request.body;
    const createdStripeCustomer = await stripe.customers.create({
      source: token,
      email
    });
    const stripeCustomer = await userModel.updateOne(
      { email },
      { $set: { "stripe.customerId": createdStripeCustomer.id } },
      { new: true }
    );
    response.locals.stripeCustomer = stripeCustomer;
    next();
  } catch (err) {
    next(new CustomError(ErrorType.CreateStripeCustomerMiddleware, err));
  }
};

export const createStripeCustomerMiddleware = getCreateStripeCustomerMiddleware(
  userModel
);

export const getCreateStripeSubscriptionMiddleware = (
  stripePlan: string
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { stripeCustomer } = response.locals;
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomer.customerId,
      items: [{ plan: stripePlan }],
      expand: ["latest_invoice.payment_intent"]
    });
    response.locals.subscription = subscription;
    next();
  } catch (err) {
    next(new CustomError(ErrorType.CreateStripeSubscriptionMiddleware, err));
  }
};

export const createStripeSubscriptionMiddleware = getCreateStripeSubscriptionMiddleware(
  STRIPE_PLAN
);

export const handleInitialPaymentOutcomeMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { subscription } = response.locals;
    const paymentIntentStatus =
      subscription.latest_invoice.payment_intent.status;
    if (
      subscription.status === "active" &&
      paymentIntentStatus === "succeeded"
    ) {
      next();
    } else if (subscription.status === "incomplete") {
      throw new CustomError(ErrorType.IncompletePayment, paymentIntentStatus);
    } else {
      throw new CustomError(ErrorType.UnknownPaymentStatus);
    }
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else {
      next(
        new CustomError(ErrorType.HandleInitialPaymentOutcomeMiddleware, err)
      );
    }
  }
};

export const getAddStripeSubscriptionToUserMiddleware = (
  userModel: Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { stripeCustomer, subscription } = response.locals;
    await userModel.update(
      { email: stripeCustomer.email },
      { $set: { "stripe.subscription": subscription } },
      { new: true }
    );
    next();
  } catch (err) {
    next(new CustomError(ErrorType.AddStripeSubscriptionToUserMiddleware, err));
  }
};

export const addStripeSubscriptionToUserMiddleware = getAddStripeSubscriptionToUserMiddleware(
  userModel
);

export const sendSuccessfulSubscriptionMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { stripeCustomer, subscription } = response.locals;
    response
      .status(ResponseCodes.created)
      .send({ stripeCustomer, subscription });
  } catch (err) {
    next(new CustomError(ErrorType.SendSuccessfulSubscriptionMiddleware, err));
  }
};

export const createStripeCustomerSubscriptionMiddlewares = [
  createStripeCustomerSubscriptionBodyValidationMiddleware,
  isUserAnExistingStripeCustomerMiddleware,
  createStripeCustomerMiddleware,
  createStripeSubscriptionMiddleware,
  handleInitialPaymentOutcomeMiddleware,
  addStripeSubscriptionToUserMiddleware,
  sendSuccessfulSubscriptionMiddleware
];
