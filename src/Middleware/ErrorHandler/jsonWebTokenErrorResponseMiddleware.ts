import { Request, Response, NextFunction } from 'express';

export const jsonWebTokenErrorResponseMiddleware = (request: Request, response: Response, next: NextFunction) => {
    try {
        const { jsonWebTokenError } = response.locals;
        if (jsonWebTokenError) return response
            .status(400)
            .send({ ...jsonWebTokenError, auth: false })
        next()
    } catch (err) {
        next(err);
    }
};

