import { NextFunction, Request, Response } from 'express';
import { ResponseCodes } from '../Server/responseCodes';

const notAllowedParameterErrorRegExp = /is not allowed/;

export const getValidationErrorMessageSenderMiddleware = (request: Request, response: Response, next: NextFunction) => (
    error: Error,
): void => {
    if (error) {
        if (notAllowedParameterErrorRegExp.test(error.message)) {
            response.status(ResponseCodes.badRequest).send({ message: error.message });
        } else {
            response.status(ResponseCodes.unprocessableEntity).send({ message: error.message });
        }
    } else {
        next();
    }
};
