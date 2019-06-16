import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import { compare } from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { jwtSecret } from "../../../secret/jwt-secret";

import { FailureMessageKeys } from "../../Messages/failureMessages";
import { SuccessMessageKeys } from "../../Messages/successMessages";
import { getLocalisedString } from "../../Messages/getLocalisedString";
import { MessageCategories } from "../../Messages/messageCategories";
import { User, IMinimumUserData } from "../../Models/User";
import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { userModel } from "../../Models/User";
import { ResponseCodes } from "../../Server/responseCodes";
import * as mongoose from "mongoose";

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface LoginResponseLocals {
  user?: User;
  passwordMatchesHash?: boolean;
  minimumUserData?: IMinimumUserData;
  jsonWebToken?: string;
  expiry?: {
    expiresIn: number;
    unitOfTime: string;
  };
}

const loginValidationSchema = {
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(6)
    .required()
};

export const loginRequestValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  Joi.validate(
    request.body,
    loginValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getRetreiveUserWithEmailMiddleware = (
  userModel: mongoose.Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { email } = request.body as LoginRequestBody;
    const user = await userModel.findOne({ email });
    response.locals.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const retreiveUserWithEmailMiddleware = getRetreiveUserWithEmailMiddleware(
  userModel
);

export const getUserExistsValidationMiddleware = (
  userDoesNotExistMessage: string
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { user } = response.locals as LoginResponseLocals;
    if (!user) {
      return response.status(ResponseCodes.badRequest).send({
        message: userDoesNotExistMessage
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};

const localisedUserDoesNotExistMessage = getLocalisedString(
  MessageCategories.failureMessages,
  FailureMessageKeys.loginUnsuccessfulMessage
);

export const userExistsValidationMiddleware = getUserExistsValidationMiddleware(
  localisedUserDoesNotExistMessage
);

export const getCompareRequestPasswordToUserHashedPasswordMiddleware = (
  compare: Function
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const requestPassword = request.body.password;
    const { password } = response.locals;
    response.locals.passwordMatchesHash = await compare(
      requestPassword,
      password
    );
    next();
  } catch (err) {
    next(err);
  }
};

export const compareRequestPasswordToUserHashedPasswordMiddleware = getCompareRequestPasswordToUserHashedPasswordMiddleware(
  compare
);

export const getPasswordsMatchValidationMiddleware = (
  loginUnsuccessfulMessage: string
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { passwordMatchesHash } = response.locals as LoginResponseLocals;
    if (!passwordMatchesHash) {
      return response.status(ResponseCodes.badRequest).send({
        message: loginUnsuccessfulMessage
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};

const localisedLoginUnsuccessfulMessage = getLocalisedString(
  MessageCategories.failureMessages,
  FailureMessageKeys.loginUnsuccessfulMessage
);

export const passwordsMatchValidationMiddleware = getPasswordsMatchValidationMiddleware(
  localisedLoginUnsuccessfulMessage
);

export const setMinimumUserDataMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { user } = response.locals;
    const minimumUserData: IMinimumUserData = {
      _id: user._id,
      userName: user.userName
    };
    response.locals.minimumUserData = minimumUserData;
    next();
  } catch (err) {
    next(err);
  }
};

export const getSetJsonWebTokenExpiryInfoMiddleware = (
  expiresIn: number,
  unitOfTime: string
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    response.locals.expiry = {
      expiresIn,
      unitOfTime
    };
    next();
  } catch (err) {
    next(err);
  }
};

const oneMonthInSeconds = 2629746;
const unitOfTime = "seconds";

export const setJsonWebTokenExpiryInfoMiddleware = getSetJsonWebTokenExpiryInfoMiddleware(
  oneMonthInSeconds,
  unitOfTime
);

export const getSetJsonWebTokenMiddleware = (
  signToken: Function,
  jwtSecret: string
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { minimumUserData, expiry } = response.locals;
    const jwtOptions = { expiresIn: expiry.expiresIn };
    const jsonWebToken: string = signToken(
      { minimumUserData },
      jwtSecret,
      jwtOptions
    );
    (response.locals as LoginResponseLocals).jsonWebToken = jsonWebToken;
    next();
  } catch (err) {
    next(err);
  }
};

export const setJsonWebTokenMiddleware = getSetJsonWebTokenMiddleware(
  jwt.sign,
  jwtSecret
);

export const getLoginSuccessfulMiddleware = (loginSuccessMessage: string) => (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { jsonWebToken, expiry } = response.locals as LoginResponseLocals;
    return response
      .status(ResponseCodes.success)
      .send({ jsonWebToken, message: loginSuccessMessage, expiry });
  } catch (err) {
    next(err);
  }
};

const localisedLoginSuccessMessage = getLocalisedString(
  MessageCategories.successMessages,
  SuccessMessageKeys.loginSuccessMessage
);

export const loginSuccessfulMiddleware = getLoginSuccessfulMiddleware(
  localisedLoginSuccessMessage
);

export const loginMiddlewares = [
  loginRequestValidationMiddleware,
  retreiveUserWithEmailMiddleware,
  userExistsValidationMiddleware,
  compareRequestPasswordToUserHashedPasswordMiddleware,
  passwordsMatchValidationMiddleware,
  setMinimumUserDataMiddleware,
  setJsonWebTokenExpiryInfoMiddleware,
  setJsonWebTokenMiddleware,
  loginSuccessfulMiddleware
];
