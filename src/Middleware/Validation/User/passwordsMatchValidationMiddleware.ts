import { Request, Response, NextFunction } from 'express';
import { FailureMessageKeys } from '../../../Messages/failureMessages';
import { getLocalisedString } from '../../../Messages/getLocalisedString';
import { MessageCategories } from '../../../Messages/messages';
import { SupportedLanguages } from '../../../Messages/supportedLanguages';

export const getPasswordsMatchValidationMiddleware = loginUnsuccessfulMessage => (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { passwordMatchesHash } = response.locals;
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
