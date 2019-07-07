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

export const setSearchQueryToLowercaseMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { searchQuery } = request.query;
    response.locals.lowerCaseSearchQuery = searchQuery.toLowerCase();
    next();
  } catch (err) {
    next(new CustomError(ErrorType.SetSearchQueryToLowercaseMiddleware, err));
  }
};

export const getRetreiveUsersByUsernameRegexSearchMiddleware = (
  userModel: mongoose.Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { lowerCaseSearchQuery } = response.locals;
    response.locals.users = await userModel.find({
      username: { $regex: lowerCaseSearchQuery }
    });
    next();
  } catch (err) {
    next(
      new CustomError(
        ErrorType.RetreiveUsersByUsernameRegexSearchMiddleware,
        err
      )
    );
  }
};

export const retreiveUsersByUsernameRegexSearchMiddleware = getRetreiveUsersByUsernameRegexSearchMiddleware(
  userModel
);

export const formatUsersMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { users } = response.locals;
    response.locals.formattedUsers = users.map((user: User) => {
      return {
        ...user.toObject(),
        password: undefined
      };
    });
    next();
  } catch (err) {
    next(new CustomError(ErrorType.FormatUsersMiddleware, err));
  }
};

export const sendFormattedUsersMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { formattedUsers } = response.locals;
    return response
      .status(ResponseCodes.success)
      .send({ users: formattedUsers });
  } catch (err) {
    next(new CustomError(ErrorType.SendFormattedUsersMiddleware, err));
  }
};

export const getUsersMiddlewares = [
  retreiveUsersValidationMiddleware,
  setSearchQueryToLowercaseMiddleware,
  retreiveUsersByUsernameRegexSearchMiddleware,
  formatUsersMiddleware,
  sendFormattedUsersMiddleware
];
