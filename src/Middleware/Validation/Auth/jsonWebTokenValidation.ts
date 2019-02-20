import { Request, Response, NextFunction } from 'express';
import { FailureMessageKeys } from '../../../Messages/failureMessages';
import { getLocalisedString } from '../../../Messages/getLocalisedString';
import { MessageCategories } from '../../../Messages/messages';

export const getJsonWebTokenValidationMiddleware = (jsonWebTokenValidationErrorObject: { auth: boolean, message: string }) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { jsonWebToken } = response.locals;
    if (!jsonWebToken) return response.status(401).send(jsonWebTokenValidationErrorObject);
    next();
  } catch (err) {
    next(err);
  }
};

const localisedMissingJsonWebTokenMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.missingJsonWebTokenMessage)

export const jsonWebTokenValidationMiddleware = getJsonWebTokenValidationMiddleware({ auth: false, message: localisedMissingJsonWebTokenMessage });
