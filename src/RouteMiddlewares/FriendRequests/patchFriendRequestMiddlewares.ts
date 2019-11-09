import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { friendRequestModel, FriendRequestModel } from '../../Models/FriendRequest';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { FriendRequest } from '@streakoid/streakoid-sdk/lib';
import { UserModel, userModel } from '../../Models/User';

const friendRequestParamsValidationSchema = {
    friendRequestId: Joi.string().required(),
};

export const friendRequestParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        friendRequestParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

const friendRequestBodyValidationSchema = {
    status: Joi.string(),
};

export const friendRequestRequestBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        friendRequestBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getPatchFriendRequestMiddleware = (friendRequestModel: mongoose.Model<FriendRequestModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { friendRequestId } = request.params;
        const keysToUpdate = request.body;
        const updatedFriendRequest = await friendRequestModel
            .findByIdAndUpdate(friendRequestId, { ...keysToUpdate }, { new: true })
            .lean();
        if (!updatedFriendRequest) {
            throw new CustomError(ErrorType.UpdatedFriendRequestNotFound);
        }
        response.locals.updatedFriendRequest = updatedFriendRequest;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PatchFriendRequestMiddleware, err));
    }
};

export const patchFriendRequestMiddleware = getPatchFriendRequestMiddleware(friendRequestModel);

export const getRetreiveFormattedRequesteeMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const updatedFriendRequest: FriendRequest = response.locals.updatedFriendRequest;
        const requestee = await userModel.findById(updatedFriendRequest.requesteeId).lean();
        if (!requestee) {
            throw new CustomError(ErrorType.RetreiveFormattedRequesteeDoesNotExist);
        }
        const formattedRequestee = {
            _id: requestee._id,
            username: requestee.username,
        };
        response.locals.formattedRequestee = formattedRequestee;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        next(new CustomError(ErrorType.RetreiveFormattedRequesteeMiddleware, err));
    }
};

export const retreiveFormattedRequesteeMiddleware = getRetreiveFormattedRequesteeMiddleware(userModel);

export const getRetreiveFormattedRequesterMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const updatedFriendRequest: FriendRequest = response.locals.updatedFriendRequest;
        const requester = await userModel.findById(updatedFriendRequest.requesterId).lean();
        if (!requester) {
            throw new CustomError(ErrorType.RetreiveFormattedRequesterDoesNotExist);
        }
        const formattedRequester = {
            _id: requester._id,
            username: requester.username,
        };

        response.locals.formattedRequester = formattedRequester;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        next(new CustomError(ErrorType.RetreiveFormattedRequesterMiddleware, err));
    }
};

export const retreiveFormattedRequesterMiddleware = getRetreiveFormattedRequesterMiddleware(userModel);

export const defineUpdatedPopulatedFriendRequestMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const updatedFriendRequest: FriendRequest = response.locals.updatedFriendRequest;
        const { formattedRequestee, formattedRequester } = response.locals;

        const updatedPopulatedFriendRequest = {
            ...updatedFriendRequest,
            requesteeId: undefined,
            requesterId: undefined,
            requestee: formattedRequestee,
            requester: formattedRequester,
        };
        response.locals.updatedPopulatedFriendRequest = updatedPopulatedFriendRequest;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.DefineUpdatedPopulatedFriendRequest, err));
    }
};

export const sendUpdatedPopulatedFriendRequestMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { updatedPopulatedFriendRequest } = response.locals;
        response.status(ResponseCodes.success).send(updatedPopulatedFriendRequest);
    } catch (err) {
        next(new CustomError(ErrorType.SendUpdatedFriendRequestMiddleware, err));
    }
};

export const patchFriendRequestMiddlewares = [
    friendRequestParamsValidationMiddleware,
    friendRequestRequestBodyValidationMiddleware,
    patchFriendRequestMiddleware,
    retreiveFormattedRequesteeMiddleware,
    retreiveFormattedRequesterMiddleware,
    defineUpdatedPopulatedFriendRequestMiddleware,
    sendUpdatedPopulatedFriendRequestMiddleware,
];
