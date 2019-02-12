import { Request, Response, NextFunction } from 'express';

export const jsonWebTokenErrorResponseMiddleware = (request: Request, response: Response, next: NextFunction) => {
    try {
        const { jsonWebTokenError } = response.locals;
        if (jsonWebTokenError) return response.send(jsonWebTokenError)
        next()
    } catch (err) {
        next(err);
    }
};

