import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { userModel, UserModel } from '../../Models/User';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const userParamsValidationSchema = {
    userId: Joi.string().required(),
};

export const userParamsValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(
        request.params,
        userParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

const userBodyValidationSchema = {
    timezone: Joi.string(),
};

export const userRequestBodyValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(
        request.body,
        userBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getPatchUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId } = request.params;
        const keysToUpdate = request.body;
        const updatedUser = await userModel.findByIdAndUpdate(userId, { ...keysToUpdate }, { new: true });
        if (!updatedUser) {
            throw new CustomError(ErrorType.UpdatedUserNotFound);
        }
        response.locals.updatedUser = updatedUser;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PatchUserMiddleware, err));
    }
};

export const patchUserMiddleware = getPatchUserMiddleware(userModel);

export const sendUpdatedUserMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { updatedUser } = response.locals;
        response.status(ResponseCodes.success).send(updatedUser);
    } catch (err) {
        next(new CustomError(ErrorType.SendUpdatedUserMiddleware, err));
    }
};

export const patchUserMiddlewares = [
    userParamsValidationMiddleware,
    userRequestBodyValidationMiddleware,
    patchUserMiddleware,
    sendUpdatedUserMiddleware,
];
