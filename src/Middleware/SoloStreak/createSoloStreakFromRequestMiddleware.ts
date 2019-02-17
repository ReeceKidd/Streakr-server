import { Request, Response, NextFunction } from 'express';
import { soloStreakModel } from '../../Models/SoloStreak';

export const getCreateSoloStreakFromRequestMiddleware = soloStreak => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { user } = response.locals;
        const { streakName, streakDescription } = request.body
        response.locals.newSoloStreak = new soloStreak({ streakName, streakDescription, user });
        next();
    } catch (err) {
        next(err)
    }
};

export const createSoloStreakFromRequestMiddleware = getCreateSoloStreakFromRequestMiddleware(soloStreakModel);
