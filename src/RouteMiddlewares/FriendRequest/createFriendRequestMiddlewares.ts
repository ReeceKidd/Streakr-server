import aws from 'aws-sdk';
import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import { Model } from 'mongoose';
import { User, FriendRequestStatus, FriendRequest } from '@streakoid/streakoid-sdk/lib';

import { friendRequestModel, FriendRequestModel } from '../../Models/FriendRequest';
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { UserModel, userModel } from '../../Models/User';
import { CustomError, ErrorType } from '../../customError';
import { ResponseCodes } from '../../Server/responseCodes';
import { getServiceConfig } from '../../../src/getServiceConfig';

const { AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID } = getServiceConfig();

aws.config.update({
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    accessKeyId: AWS_ACCESS_KEY_ID,
    region: 'eu-west-1',
});

const sns = new aws.SNS();

const createFriendRequestBodyValidationSchema = {
    requesterId: Joi.string().required(),
    requesteeId: Joi.string().required(),
};

export const createFriendRequestBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        createFriendRequestBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetreiveRequesterMiddleware = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { requesterId } = request.body;
        const requester = await userModel.findOne({ _id: requesterId }).lean();
        if (!requester) {
            throw new CustomError(ErrorType.RequesterDoesNotExist);
        }
        response.locals.requester = requester;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RetreiveRequesterMiddleware, err));
    }
};

export const retreiveRequesterMiddleware = getRetreiveRequesterMiddleware(userModel);

export const getRetreiveRequesteeMiddleware = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { requesteeId } = request.body;
        const requestee = await userModel.findOne({ _id: requesteeId }).lean();
        if (!requestee) {
            throw new CustomError(ErrorType.RequesteeDoesNotExist);
        }
        response.locals.requestee = requestee;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RetreiveRequesteeMiddleware, err));
    }
};

export const retreiveRequesteeMiddleware = getRetreiveRequesteeMiddleware(userModel);

export const getHasRequesterAlreadySentInviteMiddleware = (friendRequestModel: Model<FriendRequestModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { requesteeId, requesterId } = request.body;
        const existingFriendRequest = await friendRequestModel.findOne({
            requesteeId,
            requesterId,
            status: FriendRequestStatus.pending,
        });
        if (existingFriendRequest) {
            throw new CustomError(ErrorType.FriendRequestAlreadySent);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.HasRequesterAlreadySentInvite, err));
    }
};

export const hasRequesterAlreadySentInviteMiddleware = getHasRequesterAlreadySentInviteMiddleware(friendRequestModel);

export const requesteeIsAlreadyAFriendMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const requester: User = response.locals.requester;
        const { requesteeId } = request.body;

        const requesteeIsExistingFriend = requester.friends.find(friend => friend.friendId == requesteeId);
        if (requesteeIsExistingFriend) {
            throw new CustomError(ErrorType.RequesteeIsAlreadyAFriend);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RequesteeIsAlreadyAFriendMiddleware, err));
    }
};

export const getSaveFriendRequestToDatabaseMiddleware = (friendRequest: Model<FriendRequestModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { requesterId, requesteeId } = request.body;
        const newFriendRequest = new friendRequest({
            requesterId,
            requesteeId,
            status: FriendRequestStatus.pending,
        });
        response.locals.friendRequest = await newFriendRequest.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SaveFriendRequestToDatabaseMiddleware, err));
    }
};

export const saveFriendRequestToDatabaseMiddleware = getSaveFriendRequestToDatabaseMiddleware(friendRequestModel);

export const definePopulatedFriendRequestMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { requestee, requester } = response.locals;
        const friendRequest: FriendRequest = response.locals.friendRequest.toObject();
        const formattedRequestee = {
            _id: requestee._id,
            username: requestee.username,
        };
        const formattedRequester = {
            _id: requester._id,
            username: requester.username,
        };
        const populatedFriendRequest = {
            ...friendRequest,
            requesteeId: undefined,
            requestee: formattedRequestee,
            requesterId: undefined,
            requester: formattedRequester,
        };
        response.locals.populatedFriendRequest = populatedFriendRequest;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.PopulateFriendRequestMiddleware, err));
    }
};

export const getSendRequesteeAFriendRequestNotificationMiddleware = (snsClient: typeof sns) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const requester: UserModel = response.locals.requester;
        const requestee: UserModel = response.locals.requestee;
        const { endpointArn } = requestee;
        console.log(requestee);
        console.log('ENDPOINT');
        console.log(endpointArn);
        if (endpointArn) {
            await snsClient
                .publish({ TargetArn: endpointArn, Message: `${requester.username} sent your a friend request` })
                .promise();
        }
        next();
    } catch (err) {
        console.log(err);
        next(new CustomError(ErrorType.SendRequesteeAFriendRequestNotification, err));
    }
};

export const sendRequesteeAFriendRequestNotificationMiddleware = getSendRequesteeAFriendRequestNotificationMiddleware(
    sns,
);

export const sendPopulatedFriendRequestMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { populatedFriendRequest } = response.locals;
        response.status(ResponseCodes.created).send(populatedFriendRequest);
    } catch (err) {
        next(new CustomError(ErrorType.SendFriendRequestMiddleware, err));
    }
};

export const createFriendRequestMiddlewares = [
    createFriendRequestBodyValidationMiddleware,
    retreiveRequesterMiddleware,
    retreiveRequesteeMiddleware,
    hasRequesterAlreadySentInviteMiddleware,
    requesteeIsAlreadyAFriendMiddleware,
    saveFriendRequestToDatabaseMiddleware,
    definePopulatedFriendRequestMiddleware,
    sendRequesteeAFriendRequestNotificationMiddleware,
    sendPopulatedFriendRequestMiddleware,
];
