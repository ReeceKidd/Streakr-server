import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { userModel, UserModel } from '../../Models/User';

const userParamsValidationSchema = {
    userId: Joi.string().required(),
};

export const deleteUserParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    console.log(1);
    Joi.validate(
        request.params,
        userParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getDeleteUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        console.log(2);
        const { userId } = request.params;
        const deletedUser = await userModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            throw new CustomError(ErrorType.NoUserToDeleteFound);
        }
        response.locals.deletedUser = deletedUser;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DeleteUserMiddleware, err));
    }
};

export const deleteUserMiddleware = getDeleteUserMiddleware(userModel);

export const sendUserDeletedResponseMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        console.log(3);
        response.status(ResponseCodes.deleted).send();
    } catch (err) {
        next(new CustomError(ErrorType.SendUserDeletedResponseMiddleware, err));
    }
};

export const deleteUserMiddlewares = [
    deleteUserParamsValidationMiddleware,
    deleteUserMiddleware,
    sendUserDeletedResponseMiddleware,
];
