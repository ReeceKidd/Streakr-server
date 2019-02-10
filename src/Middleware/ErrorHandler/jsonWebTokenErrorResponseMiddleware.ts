import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from '../../../secret/jwt-secret';

export const jsonWebTokenErrorResponseMiddleware = (request: Request, response: Response, next: NextFunction) => {
    try {
        const { jsonWebTokenError } = response.locals;
        if (jsonWebTokenError) return response.send(jsonWebTokenError)
        next()
    } catch (err) {
        next(err);
    }
};

