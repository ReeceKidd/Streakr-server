import { Request, Response, NextFunction } from 'express';
import { CustomError, ErrorType } from '../customError';
import { User } from '@streakoid/streakoid-models/lib';

export const hasUserPaidMembershipMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const user: User = response.locals.user;
        const isPayingMember = user && user.membershipInformation && user.membershipInformation.isPayingMember;
        if (!isPayingMember) {
            throw new CustomError(ErrorType.UserHasNotPaidMembership);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.HasUserPaidMembershipMiddleware, err));
    }
};
