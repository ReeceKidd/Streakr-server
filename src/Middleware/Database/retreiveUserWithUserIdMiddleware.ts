import { Request, Response, NextFunction } from 'express';
import { userModel } from '../../Models/User';

export const getRetreiveUserWithUserIdMiddleware = userModel => async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    try {
        const { userId } = request.body;
        const user = await userModel.findOne({ _id: userId });
        response.locals.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

export const retreiveUserWithEmailMiddleware = getRetreiveUserWithUserIdMiddleware(userModel);