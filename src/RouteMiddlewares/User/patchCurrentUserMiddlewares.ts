import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { userModel, UserModel } from '../../Models/User';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const userBodyValidationSchema = {
    email: Joi.string().email(),
    notifications: {
        completeSoloStreaksReminder: {
            email: Joi.boolean(),
            phone: Joi.boolean(),
            reminderTime: Joi.string(),
        },
    },
    timezone: Joi.string(),
    pushNotificationToken: Joi.string(),
};

export const userRequestBodyValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(
        request.body,
        userBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getPatchCurrentUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { user } = response.locals;
        const keysToUpdate = request.body;
        const updatedUser = await userModel.findByIdAndUpdate(user._id, { ...keysToUpdate }, { new: true }).lean();
        if (!updatedUser) {
            throw new CustomError(ErrorType.UpdateCurrentUserNotFound);
        }
        response.locals.updatedUser = updatedUser;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PatchCurrentUserMiddleware, err));
    }
};

export const patchCurrentUserMiddleware = getPatchCurrentUserMiddleware(userModel);

export const sendUpdatedCurrentUserMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { formattedUser } = response.locals;
        response.status(ResponseCodes.success).send(formattedUser);
    } catch (err) {
        next(new CustomError(ErrorType.SendUpdatedCurrentUserMiddleware, err));
    }
};

export const patchCurrentUserMiddlewares = [
    userRequestBodyValidationMiddleware,
    patchCurrentUserMiddleware,
    sendUpdatedCurrentUserMiddleware,
];
