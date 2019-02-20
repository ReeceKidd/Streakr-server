import { Request, Response, NextFunction } from 'express';
import { MessageCategories } from 'Messages/messages';
import { SuccessMessageKeys } from 'Messages/successMessages';
import { getLocalisedString } from 'Messages/getLocalisedString';

export const getLoginSuccessfulMiddleware = (loginSuccessMessage: string) => (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { jsonWebToken } = response.locals;
    return response.send({ jsonWebToken, message: loginSuccessMessage });
  } catch (err) {
    next(err);
  }
};

const localisedLoginSuccessMessage = getLocalisedString(MessageCategories.successMessages, SuccessMessageKeys.loginSuccessMessage)

export const loginSuccessfulMiddleware = getLoginSuccessfulMiddleware(localisedLoginSuccessMessage);
