import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import { getServiceConfig } from "../../getServiceConfig";
import Stripe from "stripe";
import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { Model } from "mongoose";
import { User, UserTypes, userModel } from "../../Models/User";
import { CustomError, ErrorType } from "../../customError";
import { ResponseCodes } from "../../Server/responseCodes";

const { STRIPE_SHAREABLE_KEY } = getServiceConfig();

export const stripe = new Stripe(STRIPE_SHAREABLE_KEY);

const cancelStripeCustomerSubscriptionBodySchema = {
  subscription: Joi.string().required(),
  email: Joi.string()
    .email()
    .required()
};

export const cancelStripeCustomerSubscriptionBodyValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  Joi.validate(
    request.body,
    cancelStripeCustomerSubscriptionBodySchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getDoesUserHaveStripeSubscriptionMiddleware = (
  userModel: Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { email } = request.body;
    const user = (await userModel.findOne({ email })) as User;
    if (!user) {
      throw new CustomError(ErrorType.CancelStripeSubscriptionUserDoesNotExist);
    }
    if (user.type !== UserTypes.premium) {
      throw new CustomError(ErrorType.CustomerIsNotSubscribed);
    }
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else {
      next(
        new CustomError(ErrorType.DoesUserHaveStripeSubscriptionMiddleware, err)
      );
    }
  }
};

export const doesUserHaveStripeSubscriptionMiddleware = getDoesUserHaveStripeSubscriptionMiddleware(
  userModel
);

export const cancelStripeSubscriptionMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { subscription } = request.body;
    await stripe.subscriptions.del(subscription);
    next();
  } catch (err) {
    next(new CustomError(ErrorType.CancelStripeSubscriptionMiddleware, err));
  }
};

export const getRemoveSubscriptionFromUserMiddleware = (
  userModel: Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { email } = request.body;
    const updatedUser = await userModel.updateOne(
      { email },
      { $set: { "stripe.subscription": false } },
      { new: true }
    );
    response.locals.updatedUser = updatedUser;
    next();
  } catch (err) {
    next(new CustomError(ErrorType.RemoveSubscriptionFromUserMiddleware, err));
  }
};

export const removeSubscriptionFromUserMiddleware = getRemoveSubscriptionFromUserMiddleware(
  userModel
);

export const sendSuccessfullyRemovedSubscriptionMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { updatedUser } = response.locals;
    response.status(ResponseCodes.deleted).send({ user: updatedUser });
  } catch (err) {
    next(
      new CustomError(
        ErrorType.SendSuccessfullyRemovedSubscriptionMiddleware,
        err
      )
    );
  }
};

export const cancelStripeCustomerSubscriptionMiddlewares = [
  cancelStripeCustomerSubscriptionBodyValidationMiddleware,
  doesUserHaveStripeSubscriptionMiddleware,
  cancelStripeSubscriptionMiddleware,
  removeSubscriptionFromUserMiddleware,
  sendSuccessfullyRemovedSubscriptionMiddleware
];
