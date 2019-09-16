import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { userModel, UserModel } from "../../Models/User";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

export const minimumSeachQueryLength = 1;
export const maximumSearchQueryLength = 64;

const getUsersValidationSchema = {
  searchQuery: Joi.string()
    .min(minimumSeachQueryLength)
    .max(maximumSearchQueryLength)
};

export const getUsersValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  Joi.validate(
    request.query,
    getUsersValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getRetreiveUsersByLowercaseUsernameRegexSearchMiddleware = (
  userModel: mongoose.Model<UserModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { searchQuery } = request.query;
    if (searchQuery) {
      response.locals.users = await userModel.find({
        username: { $regex: searchQuery.toLowerCase() }
      });
    } else {
      response.locals.users = await userModel.find({});
    }
    next();
  } catch (err) {
    next(
      new CustomError(
        ErrorType.RetreiveUsersByLowercaseUsernameRegexSearchMiddleware,
        err
      )
    );
  }
};

export const retreiveUsersByLowercaseUsernameRegexSearchMiddleware = getRetreiveUsersByLowercaseUsernameRegexSearchMiddleware(
  userModel
);

export const sendFormattedUsersMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { users } = response.locals;
    return response.status(ResponseCodes.success).send(users);
  } catch (err) {
    next(new CustomError(ErrorType.SendUsersMiddleware, err));
  }
};

export const getUsersMiddlewares = [
  getUsersValidationMiddleware,
  retreiveUsersByLowercaseUsernameRegexSearchMiddleware,
  sendFormattedUsersMiddleware
];
