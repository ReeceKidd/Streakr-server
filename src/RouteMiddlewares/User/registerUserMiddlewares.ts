
import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import { hash } from 'bcryptjs';

import { userModel } from '../../Models/User';
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { generateAlreadyExistsMessage } from '../../Utils/generateAlreadyExistsMessage';
import { emailKey, userNameKey } from '../../Constants/Keys/keys';
import { saltRounds } from '../../Constants/Auth/saltRounds';
import { ResponseCodes } from '../../Server/responseCodes';

const registerValidationSchema = {
  userName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
};

export const userRegistrationValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
  Joi.validate(request.body, registerValidationSchema, getValidationErrorMessageSenderMiddleware(request, response, next));
};

export const getDoesUserEmailExistMiddleware = userModel => async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { email } = request.body;
    const user = await userModel.findOne({ email });
    if (user) {
      response.locals.emailExists = true;
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const doesUserEmailExistMiddleware = getDoesUserEmailExistMiddleware(userModel);

interface GenerateEmailAlreadyExistsMessage {
  (userSubject: string, userEmail: string, userKey: string): string
}

export const getEmailExistsValidationMiddleware = (emailAlreadyExistsMessage: GenerateEmailAlreadyExistsMessage, subject: string, emailKey: string) => (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { emailExists } = response.locals;
    const { email } = request.body;
    if (emailExists) {
      return response.status(ResponseCodes.badRequest).send({
        message: emailAlreadyExistsMessage(
          subject,
          emailKey,
          email
        ),
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const emailExistsValidationMiddleware = getEmailExistsValidationMiddleware(generateAlreadyExistsMessage, 'User', emailKey);

export const setUserNameToLowercaseMiddleware = (request: Request, response: Response, next: NextFunction) => {
  try {
    const { userName } = request.body
    response.locals.lowerCaseUserName = userName.toLowerCase()
    next()
  } catch (err) {
    next(err)
  }
}

export const getDoesUserNameExistMiddleware = userModel => async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { lowerCaseUserName } = response.locals;
    const user = await userModel.findOne({ userName: lowerCaseUserName });
    if (user) {
      response.locals.userNameExists = true;
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const doesUserNameExistMiddleware = getDoesUserNameExistMiddleware(userModel);

interface GenerateUserNameAlreadyExistsMessage {
  (userSubject: string, userName: string, userKey: string): string
}

export const getUserNameExistsValidationMiddleware = (generateAlreadyExistsMessage: GenerateUserNameAlreadyExistsMessage, subject: string, userNameKey) => (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { userNameExists, lowerCaseUserName } = response.locals;
    if (userNameExists) {
      return response.status(ResponseCodes.badRequest).send({
        message: generateAlreadyExistsMessage(
          subject,
          userNameKey,
          lowerCaseUserName,
        ),
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const userNameExistsValidationMiddleware = getUserNameExistsValidationMiddleware(generateAlreadyExistsMessage, 'User', userNameKey);

export const getHashPasswordMiddleware = (hash, salt) => async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { password } = request.body;
    response.locals.hashedPassword = await hash(password, salt);
    next();
  } catch (err) {
    next(err);
  }
};

export const hashPasswordMiddleware = getHashPasswordMiddleware(hash, saltRounds);

export const getCreateUserFromRequestMiddleware = user => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { hashedPassword, lowerCaseUserName } = response.locals;
    const { email } = request.body;
    response.locals.newUser = new user({ userName: lowerCaseUserName, email, password: hashedPassword });
    next();
  } catch (err) {
    next(err)
  }
};

export const createUserFromRequestMiddleware = getCreateUserFromRequestMiddleware(userModel);

export const saveUserToDatabaseMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { newUser } = response.locals;
    response.locals.savedUser = await newUser.save();
    next();
  } catch (err) {
    next(err);
  }
};

export const sendFormattedUserMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { savedUser } = response.locals;
    savedUser.password = undefined;
    return response.status(ResponseCodes.created).send(savedUser);
  } catch (err) {
    next(err);
  }
};

export const registerUserMiddlewares = [
  userRegistrationValidationMiddleware,
  doesUserEmailExistMiddleware,
  emailExistsValidationMiddleware,
  setUserNameToLowercaseMiddleware,
  doesUserNameExistMiddleware,
  userNameExistsValidationMiddleware,
  hashPasswordMiddleware,
  createUserFromRequestMiddleware,
  saveUserToDatabaseMiddleware,
  sendFormattedUserMiddleware
];
