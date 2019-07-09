import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import { hash } from "bcryptjs";
import { Model } from "mongoose";

import { userModel, User } from "../../Models/User";
import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { saltRounds } from "../../Constants/Auth/saltRounds";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

const registerValidationSchema = {
  username: Joi.string().required(),
  email: Joi.string()
    .email()
    .required()
};

export const userRegistrationValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  Joi.validate(
    request.body,
    registerValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getDoesUserEmailExistMiddleware = (
  userModel: Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { email } = request.body;
    const user = await userModel.findOne({ email });
    if (user) {
      throw new CustomError(ErrorType.UserEmailAlreadyExists);
    }
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.DoesUserEmailExistMiddleware, err));
  }
};

export const doesUserEmailExistMiddleware = getDoesUserEmailExistMiddleware(
  userModel
);

export const setUsernameToLowercaseMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { username } = request.body;
    response.locals.lowerCaseUsername = username.toLowerCase();
    next();
  } catch (err) {
    next(new CustomError(ErrorType.SetUsernameToLowercaseMiddleware, err));
  }
};

export const getDoesUsernameExistMiddleware = (
  userModel: Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { lowerCaseUsername } = response.locals;
    const user = await userModel.findOne({ username: lowerCaseUsername });
    if (user) {
      throw new CustomError(ErrorType.UsernameAlreadyExists);
    }
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.DoesUsernameAlreadyExistMiddleware));
  }
};

export const doesUsernameExistMiddleware = getDoesUsernameExistMiddleware(
  userModel
);

export const getSaveUserToDatabaseMiddleware = (user: Model<User>) => async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { lowerCaseUsername } = response.locals;
    console.log(lowerCaseUsername);
    const { email } = request.body;
    const newUser = new user({
      username: lowerCaseUsername,
      email
    });
    response.locals.savedUser = await newUser.save();
    next();
  } catch (err) {
    console.log(err);
    next(new CustomError(ErrorType.SaveUserToDatabaseMiddleware, err));
  }
};

export const saveUserToDatabaseMiddleware = getSaveUserToDatabaseMiddleware(
  userModel
);

export const sendFormattedUserMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { savedUser } = response.locals;
    return response.status(ResponseCodes.created).send(savedUser);
  } catch (err) {
    next(new CustomError(ErrorType.SendFormattedUserMiddleware, err));
  }
};

export const registerUserMiddlewares = [
  userRegistrationValidationMiddleware,
  doesUserEmailExistMiddleware,
  setUsernameToLowercaseMiddleware,
  doesUsernameExistMiddleware,
  saveUserToDatabaseMiddleware,
  sendFormattedUserMiddleware
];
