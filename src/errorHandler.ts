import { Request, Response } from 'express';

import { CustomError } from './customError';
import { ResponseCodes } from './Server/responseCodes';
import { NextFunction } from 'connect';

export const errorHandler = (
    error: CustomError,
    request: Request,
    response: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
): Response => {
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
