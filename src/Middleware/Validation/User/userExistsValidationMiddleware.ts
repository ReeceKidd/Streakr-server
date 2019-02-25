import { Request, Response, NextFunction } from 'express';
import { FailureMessageKeys } from '../../../Messages/failureMessages';
import { getLocalisedString } from '../../../Messages/getLocalisedString';
import { MessageCategories } from '../../../Messages/messageCategories';
import { LoginResponseLocals } from 'Routes/Auth/login';

export const getUserExistsValidationMiddleware = userDoesNotExistMessage => (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { user } = response.locals as LoginResponseLocals;
    if (!user) {
      return response.status(400).send({
        message: userDoesNotExistMessage,
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};

const localisedUserDoesNotExistMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.loginUnsuccessfulMessage)

export const userExistsValidationMiddleware = getUserExistsValidationMiddleware(localisedUserDoesNotExistMessage);
