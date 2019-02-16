import { Request, Response, NextFunction } from 'express';
import { userModel } from '../../Models/User';

export const getRetreiveUserWhoCreatedStreakMiddleware = userModel => async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    try {
        const { userWhoCreatedStreakId } = request.body;
        const user = await userModel.findOne({ _id: userWhoCreatedStreakId });
        response.locals.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

export const retreiveUserWithUserIdMiddleware = getRetreiveUserWhoCreatedStreakMiddleware(userModel);