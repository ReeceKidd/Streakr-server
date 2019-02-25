import { Request, Response, NextFunction } from 'express';
import { MessageCategories } from '../../Messages/messageCategories';
import { SuccessMessageKeys } from '../../Messages/successMessages';
import { getLocalisedString } from '../../Messages/getLocalisedString';
import { LoginResponseLocals } from 'Routes/Auth/login';

export const getLoginSuccessfulMiddleware = (loginSuccessMessage: string) => (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { jsonWebToken } = response.locals as LoginResponseLocals;
    return response.send({ jsonWebToken, message: loginSuccessMessage });
  } catch (err) {
    next(err);
  }
};

const localisedLoginSuccessMessage = getLocalisedString(MessageCategories.successMessages, SuccessMessageKeys.loginSuccessMessage)

export const loginSuccessfulMiddleware = getLoginSuccessfulMiddleware(localisedLoginSuccessMessage);
