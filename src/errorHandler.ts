import { Request, Response } from 'express';

import { CustomError } from './customError';
import { ResponseCodes } from './Server/responseCodes';
import { NextFunction } from 'connect';
import * as Sentry from '@sentry/node';
import { getServiceConfig } from './getServiceConfig';
const { NODE_ENV } = getServiceConfig();

export const errorHandler = (
    error: CustomError,
    request: Request,
    response: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
): Response => {
    if (error.httpStatusCode === ResponseCodes.warning) {
        if (NODE_ENV !== 'test') {
            const user = response.locals.user;
            if (user) {
                Sentry.setUser({ email: user.email, id: user._id, username: user.username });
            }
            Sentry.captureException(error);
        }

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
