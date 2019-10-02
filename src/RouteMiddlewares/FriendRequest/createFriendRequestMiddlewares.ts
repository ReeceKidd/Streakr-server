import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import { Model } from "mongoose";
import { User, FriendRequestStatus } from "@streakoid/streakoid-sdk/lib";

import {
  friendRequestModel,
  FriendRequestModel
} from "../../Models/FriendRequest";
import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { UserModel, userModel } from "../../Models/User";
import { CustomError, ErrorType } from "../../customError";
import { ResponseCodes } from "../../Server/responseCodes";

const createFriendRequestBodyValidationSchema = {
  requesterId: Joi.string().required(),
  requesteeId: Joi.string().required()
};

export const createFriendRequestBodyValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  Joi.validate(
    request.body,
    createFriendRequestBodyValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getRetreiveRequesterMiddleware = (
  userModel: Model<UserModel>
) => async (request: Request, response: Response, next: NextFunction) => {
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

export const retreiveRequesterMiddleware = getRetreiveRequesterMiddleware(
  userModel
);

export const getRetreiveRequesteeMiddleware = (
  userModel: Model<UserModel>
) => async (request: Request, response: Response, next: NextFunction) => {
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

export const retreiveRequesteeMiddleware = getRetreiveRequesteeMiddleware(
  userModel
);

export const requesteeIsAlreadyAFriendMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const requester: User = response.locals.requester;
    const { requesteeId } = request.body;

    const requesteeIsExistingFriend = requester.friends.find(
      friend => friend === requesteeId
    );
    if (requesteeIsExistingFriend) {
      throw new CustomError(ErrorType.RequesteeIsAlreadyAFriend);
    }
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else
      next(new CustomError(ErrorType.RequesteeIsAlreadyAFriendMiddleware, err));
  }
};

export const getSaveFriendRequestToDatabaseMiddleware = (
  friendRequest: Model<FriendRequestModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { requesterId, requesteeId } = request.body;
    const newFriendRequest = new friendRequest({
      requesterId,
      requesteeId,
      status: FriendRequestStatus.pending
    });
    response.locals.friendRequest = await newFriendRequest.save();
    next();
  } catch (err) {
    next(new CustomError(ErrorType.SaveFriendRequestToDatabaseMiddleware, err));
  }
};

export const saveFriendRequestToDatabaseMiddleware = getSaveFriendRequestToDatabaseMiddleware(
  friendRequestModel
);

export const sendFriendRequestMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { friendRequest } = response.locals;
    response.status(ResponseCodes.created).send(friendRequest);
  } catch (err) {
    next(new CustomError(ErrorType.SendFriendRequestMiddleware, err));
  }
};

export const createFriendRequestMiddlewares = [
  createFriendRequestBodyValidationMiddleware,
  retreiveRequesterMiddleware,
  retreiveRequesteeMiddleware,
  saveFriendRequestToDatabaseMiddleware,
  sendFriendRequestMiddleware
];
