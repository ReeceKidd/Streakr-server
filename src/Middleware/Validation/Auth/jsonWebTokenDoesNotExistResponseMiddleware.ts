import { Request, Response, NextFunction } from 'express';
import { FailureMessageKeys } from '../../../Messages/failureMessages';
import { getLocalisedString } from '../../../Messages/getLocalisedString';
import { MessageCategories } from '../../../Messages/messageCategories';
import { VerifyJsonWebTokenResponseLocals } from 'Utils/verifyUsersJsonWebToken';

export const getJsonWebTokenDoesNotExistResponseMiddleware = (jsonWebTokenValidationErrorObject: { auth: boolean, message: string }) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { jsonWebToken } = response.locals as VerifyJsonWebTokenResponseLocals;
    if (!jsonWebToken) return response.status(401).send(jsonWebTokenValidationErrorObject);
    next();
  } catch (err) {
    next(err);
  }
};

const localisedMissingJsonWebTokenMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.missingJsonWebTokenMessage)

export const jsonWebTokenDoesNotExistResponseMiddleware = getJsonWebTokenDoesNotExistResponseMiddleware({ auth: false, message: localisedMissingJsonWebTokenMessage });
