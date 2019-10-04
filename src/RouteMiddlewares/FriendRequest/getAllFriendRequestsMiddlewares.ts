import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import {
  FriendRequestModel,
  friendRequestModel
} from "../../Models/FriendRequest";
import { FriendRequest } from "@streakoid/streakoid-sdk/lib";
import { UserModel, userModel } from "../../Models/User";

const getFriendRequestsQueryValidationSchema = {
  requesterId: Joi.string(),
  requesteeId: Joi.string(),
  status: Joi.string()
};

export const getFriendRequestsQueryValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.query,
    getFriendRequestsQueryValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getFindFriendRequestsMiddleware = (
  friendRequestModel: mongoose.Model<FriendRequestModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { requesterId, requesteeId, status } = request.query;

    const query: {
      requesterId?: string;
      requesteeId?: string;
      status?: string;
    } = {};

    if (requesterId) {
      query.requesterId = requesterId;
    }
    if (requesteeId) {
      query.requesteeId = requesteeId;
    }
    if (status) {
      query.status = status;
    }

    const friendRequests = await friendRequestModel.find(query).lean();
    response.locals.friendRequests = friendRequests;
    next();
  } catch (err) {
    next(new CustomError(ErrorType.FindFriendRequestsMiddleware, err));
  }
};

export const findFriendRequestsMiddleware = getFindFriendRequestsMiddleware(
  friendRequestModel
);

export const getPopulateFriendRequestsMiddleware = (
  userModel: mongoose.Model<UserModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const friendRequests: FriendRequest[] = response.locals.friendRequests;
    const populatedFriendRequests = await Promise.all(
      friendRequests.map(async friendRequest => {
        const requestee = await userModel
          .findById(friendRequest.requesteeId)
          .lean();
        const formattedRequestee = {
          _id: requestee!._id,
          username: requestee!.username
        };

        const requester = await userModel
          .findById(friendRequest.requesterId)
          .lean();
        const formattedRequester = {
          _id: requester!._id,
          username: requester!.username
        };

        return {
          ...friendRequest,
          requesteeId: undefined,
          requestee: formattedRequestee,
          requesterId: undefined,
          requester: formattedRequester
        };
      })
    );
    response.locals.populatedFriendRequests = populatedFriendRequests;
    next();
  } catch (err) {
    next(new CustomError(ErrorType.PopulateFriendRequestsMiddleware, err));
  }
};

export const populateFriendRequestsMiddleware = getPopulateFriendRequestsMiddleware(
  userModel
);

export const sendPopulatedFriendRequestsMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { populatedFriendRequests } = response.locals;
    response.status(ResponseCodes.success).send(populatedFriendRequests);
  } catch (err) {
    next(new CustomError(ErrorType.SendFriendRequestsMiddleware, err));
  }
};

export const getAllFriendRequestsMiddlewares = [
  getFriendRequestsQueryValidationMiddleware,
  findFriendRequestsMiddleware,
  populateFriendRequestsMiddleware,
  sendPopulatedFriendRequestsMiddleware
];
