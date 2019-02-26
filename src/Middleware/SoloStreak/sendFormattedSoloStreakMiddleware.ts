import { Request, Response, NextFunction } from 'express';
import { SoloStreakResponseLocals } from '../../Routes/SoloStreak/createSoloStreakMiddlewares';

export const sendFormattedSoloStreakMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    try {
        const locals: SoloStreakResponseLocals = response.locals
        const { savedSoloStreak } = locals;
        return response.send(savedSoloStreak);
    } catch (err) {
        next(err);
    }
};
