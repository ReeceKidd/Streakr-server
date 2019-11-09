import { Request, Response, NextFunction } from 'express';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

export const sendCurrentUserMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { user } = response.locals;
        response.status(ResponseCodes.success).send(user);
    } catch (err) {
        next(new CustomError(ErrorType.SendCurrentUserMiddleware, err));
    }
};

export const getCurrentUserMiddlewares = [sendCurrentUserMiddleware];
