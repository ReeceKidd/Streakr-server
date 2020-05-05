import { Request, Response } from 'express';
import * as Sentry from '@sentry/node';

import { CustomError } from './customError';
import { ResponseCodes } from './Server/responseCodes';
import { NextFunction } from 'connect';
import { getServiceConfig } from './getServiceConfig';
const { NODE_ENV } = getServiceConfig();

export const errorHandler = (
    error: CustomError,
    request: Request,
    response: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
): Response => {
    if (NODE_ENV !== 'test') {
        const user = response.locals.user;
        if (user && user.email && user.username && user._id) {
            Sentry.setUser({ email: user.email, username: user.username, id: user._id });
        }
        Sentry.captureException(error);
    }
    if (error.httpStatusCode === ResponseCodes.warning) {
        return response.status(error.httpStatusCode).send({
            ...error,
            message: 'Internal server error',
        });
    }
    if (error.httpStatusCode) {
        return response.status(error.httpStatusCode).send(error);
    }

    return response.status(ResponseCodes.warning).send(error);
};
