import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import { hash } from "bcryptjs";
import { Model } from "mongoose";
import * as nodeFetch from "node-fetch";
// @ts-ignore
global.fetch = nodeFetch;
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser
} from "amazon-cognito-identity-js";

import { userModel, User } from "../../Models/User";
import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { saltRounds } from "../../Constants/Auth/saltRounds";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

const registerValidationSchema = {
  userName: Joi.string().required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(6)
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
    const { userName } = request.body;
    response.locals.lowerCaseUserName = userName.toLowerCase();
    next();
  } catch (err) {
    next(new CustomError(ErrorType.SetUsernameToLowercaseMiddleware, err));
  }
};

export const getDoesUsernameExistMiddleware = (
  userModel: Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { lowerCaseUserName } = response.locals;
    const user = await userModel.findOne({ userName: lowerCaseUserName });
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

export const getHashPasswordMiddleware = (
  hash: Function,
  saltRounds: number
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { password } = request.body;
    response.locals.hashedPassword = await hash(password, saltRounds);
    next();
  } catch (err) {
    next(new CustomError(ErrorType.HashPasswordMiddleware, err));
  }
};

export const hashPasswordMiddleware = getHashPasswordMiddleware(
  hash,
  saltRounds
);

export const getSaveUserToDatabaseMiddleware = (user: Model<User>) => async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { hashedPassword, lowerCaseUserName } = response.locals;
    const { email } = request.body;
    const newUser = new user({
      userName: lowerCaseUserName,
      email,
      password: hashedPassword
    });
    response.locals.savedUser = await newUser.save();
    next();
  } catch (err) {
    next(new CustomError(ErrorType.SaveUserToDatabaseMiddleware, err));
  }
};

export const saveUserToDatabaseMiddleware = getSaveUserToDatabaseMiddleware(
  userModel
);

export const registerUserWithCognitoMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { email, userName, password } = request.body;
    // Need to make these environment variables.
    const poolData = {
      UserPoolId: "eu-west-1_S0HecFXKe",
      ClientId: "4sipjiblpt7229io7ce389401e"
    };

    const userPool = new CognitoUserPool(poolData);

    const attributeList = [];

    const dataEmail = {
      Name: "email",
      Value: email
    };

    const attributeEmail = new CognitoUserAttribute(dataEmail);

    attributeList.push(attributeEmail);

    userPool.signUp(userName, password, attributeList, [], function(
      err,
      result
    ) {
      if (err) {
        console.log(err);
        next(new CustomError(ErrorType.CognitoSignUpError, err));
      } else {
        const cognitoUser = result && result.user;
        response.locals.cognitoUser = cognitoUser;
        console.log(cognitoUser);
        next();
      }
    });
  } catch (err) {
    console.log(err);
    if (err instanceof CustomError) next(err);
    next(new CustomError(ErrorType.RegisterUserWithCognitoMiddleware, err));
  }
};

export const sendFormattedUserMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { savedUser } = response.locals;
    savedUser.password = undefined;
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
  hashPasswordMiddleware,
  saveUserToDatabaseMiddleware,
  registerUserWithCognitoMiddleware,
  sendFormattedUserMiddleware
];
