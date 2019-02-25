import { Request, Response, NextFunction } from 'express';
import { FailureMessageKeys } from '../../../Messages/failureMessages';
import { getLocalisedString } from '../../../Messages/getLocalisedString';
import { MessageCategories } from '../../../Messages/messageCategories';
import { LoginResponseLocals } from 'Routes/Auth/login';


export const getPasswordsMatchValidationMiddleware = loginUnsuccessfulMessage => (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { passwordMatchesHash } = response.locals as LoginResponseLocals;
    if (!passwordMatchesHash) {
      return response.status(400).send({
        message: loginUnsuccessfulMessage,
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};

const localisedLoginUnsuccessfulMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.loginUnsuccessfulMessage)

export const passwordsMatchValidationMiddleware = getPasswordsMatchValidationMiddleware(localisedLoginUnsuccessfulMessage);
