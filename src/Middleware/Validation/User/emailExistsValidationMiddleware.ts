import { Request, Response, NextFunction } from 'express';
import { generateAlreadyExistsMessage } from '../../../Utils/generateAlreadyExistsMessage';
import { emailKey } from '../../../Constants/Keys/keys';

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
      return response.status(400).send({
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
