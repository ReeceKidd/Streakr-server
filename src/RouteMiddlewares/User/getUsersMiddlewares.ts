import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { userModel, User } from "../../Models/User";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

export const minimumSeachQueryLength = 1;
export const maximumSearchQueryLength = 64;

const getUsersValidationSchema = {
  searchQuery: Joi.string()
    .min(minimumSeachQueryLength)
    .max(maximumSearchQueryLength)
    .required()
};

export const retreiveUsersValidationMiddleware = (
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
  userModel: mongoose.Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { searchQuery } = request.query;
    response.locals.users = await userModel.find({
      username: { $regex: searchQuery.toLowerCase() }
    });
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
    return response.status(ResponseCodes.success).send({ users });
  } catch (err) {
    next(new CustomError(ErrorType.SendUsersMiddleware, err));
  }
};

export const getUsersMiddlewares = [
  retreiveUsersValidationMiddleware,
  retreiveUsersByLowercaseUsernameRegexSearchMiddleware,
  sendFormattedUsersMiddleware
];
