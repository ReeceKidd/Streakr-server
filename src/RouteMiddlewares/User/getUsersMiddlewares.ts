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
    .max(maximumSearchQueryLength),
  username: Joi.string(),
  email: Joi.string().email()
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

export const getRetreiveUsersMiddleware = (
  userModel: mongoose.Model<UserModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { searchQuery, username, email } = request.query;
    if (searchQuery) {
      response.locals.users = await userModel.find({
        username: { $regex: searchQuery.toLowerCase() }
      });
    } else if (username) {
      response.locals.users = await userModel.find({
        username
      });
    } else if (email) {
      response.locals.users = await userModel.find({
        email
      });
    } else {
      response.locals.users = await userModel.find({});
    }
    next();
  } catch (err) {
    next(new CustomError(ErrorType.RetreiveUsersMiddleware, err));
  }
};

export const retreiveUsersMiddleware = getRetreiveUsersMiddleware(userModel);

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
  retreiveUsersMiddleware,
  sendFormattedUsersMiddleware
];
