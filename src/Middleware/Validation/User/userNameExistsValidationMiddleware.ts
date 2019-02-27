import { Request, Response, NextFunction } from 'express';
import { generateAlreadyExistsMessage } from '../../../Utils/generateAlreadyExistsMessage';
import { userNameKey } from '../../../Constants/Keys/keys';

interface GenerateUserNameAlreadyExistsMessage {
  (userSubject: string, userName: string, userKey: string): string
}

export const getUserNameExistsValidationMiddleware = (generateAlreadyExistsMessage: GenerateUserNameAlreadyExistsMessage, subject: string, userNameKey) => (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { userNameExists } = response.locals;
    const { userName } = request.body;
    if (userNameExists) {
      return response.status(400).send({
        message: generateAlreadyExistsMessage(
          subject,
          userNameKey,
          userName,
        ),
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const userNameExistsValidationMiddleware = getUserNameExistsValidationMiddleware(generateAlreadyExistsMessage, 'User', userNameKey);
