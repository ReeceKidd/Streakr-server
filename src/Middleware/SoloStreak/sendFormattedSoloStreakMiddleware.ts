import { Request, Response, NextFunction } from 'express';

export const sendFormattedSoloStreakMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    try {
        const { savedSoloStreak } = response.locals;
        return response.send(savedSoloStreak);
    } catch (err) {
        next(err);
    }
};
