import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { User } from "../../../Models/User";
import { CustomError, ErrorType } from "../../../customError";
import { ResponseCodes } from "../../../Server/responseCodes";

export const minimumSeachQueryLength = 1;
export const maximumSearchQueryLength = 64;

const getFriendsParamsValidationSchema = {
  userId: Joi.string().required()
};

export const getFriendsParamsValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.params,
    getFriendsParamsValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

const getFriendsQueryValidationSchema = {
  searchQuery: Joi.string()
    .min(minimumSeachQueryLength)
    .max(maximumSearchQueryLength)
    .required()
};

export const getFriendsQueryValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  Joi.validate(
    request.query,
    getFriendsQueryValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getRetreiveFriendsMiddleware = (
  userModel: mongoose.Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { userId } = request.params;
    const { searchQuery } = request.query;
    if (searchQuery) {
      response.locals.friends = await userModel.find({
        _id: userId,
        "friends.username": { $regex: searchQuery.toLowerCase() }
      });
    } else {
      response.locals.friends = await userModel.findById(userId, {
        friends: 1
      });
    }
    next();
  } catch (err) {
    next(new CustomError(ErrorType.RetreiveFriendsMiddleware, err));
  }
};

export const sendFormattedFriendsMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { friends } = response.locals;
    return response.status(ResponseCodes.success).send({ friends });
  } catch (err) {
    next(new CustomError(ErrorType.SendFormattedFriendsMiddleware, err));
  }
};

export const getFriendsMiddlewares = [
  getFriendsParamsValidationMiddleware,
  getFriendsQueryValidationMiddleware,
  getRetreiveFriendsMiddleware,
  sendFormattedFriendsMiddleware
];
