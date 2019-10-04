import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import {
  friendRequestModel,
  FriendRequestModel
} from "../../Models/FriendRequest";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import { FriendRequest } from "@streakoid/streakoid-sdk/lib";
import { UserModel, userModel } from "../../Models/User";

const friendRequestParamsValidationSchema = {
  friendRequestId: Joi.string().required()
};

export const friendRequestParamsValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.params,
    friendRequestParamsValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

const friendRequestBodyValidationSchema = {
  status: Joi.string()
};

export const friendRequestRequestBodyValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.body,
    friendRequestBodyValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getPatchFriendRequestMiddleware = (
  friendRequestModel: mongoose.Model<FriendRequestModel>
) => async (request: Request, response: Response, next: NextFunction) => {
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

export const patchFriendRequestMiddleware = getPatchFriendRequestMiddleware(
  friendRequestModel
);

export const getPopulateUpdatedFriendRequestMiddleware = (
  userModel: mongoose.Model<UserModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const updatedFriendRequest: FriendRequest =
      response.locals.updatedFriendRequest;
    const requestee = await userModel.findById(
      updatedFriendRequest.requesteeId
    );
    const formattedRequestee = {
      _id: requestee!._id,
      username: requestee!.username
    };

    const requester = await userModel.findById(
      updatedFriendRequest.requesterId
    );
    const formattedRequester = {
      _id: requester!._id,
      username: requester!.username
    };

    const updatedPopulatedFriendRequest = {
      ...updatedFriendRequest,
      requesteeId: undefined,
      requesterId: undefined,
      requestee: formattedRequestee,
      requester: formattedRequester
    };
    response.locals.updatedPopulatedFriendRequest = updatedPopulatedFriendRequest;
    next();
  } catch (err) {
    next(
      new CustomError(ErrorType.PopulateUpdatedFriendRequestMiddleware, err)
    );
  }
};

export const populateUpdatedFriendRequestMiddleware = getPopulateUpdatedFriendRequestMiddleware(
  userModel
);

export const sendUpdatedPopulatedFriendRequestMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { updatedPopulatedFriendRequest } = response.locals;
    return response
      .status(ResponseCodes.success)
      .send(updatedPopulatedFriendRequest);
  } catch (err) {
    next(new CustomError(ErrorType.SendUpdatedFriendRequestMiddleware, err));
  }
};

export const patchFriendRequestMiddlewares = [
  friendRequestParamsValidationMiddleware,
  friendRequestRequestBodyValidationMiddleware,
  patchFriendRequestMiddleware,
  populateUpdatedFriendRequestMiddleware,
  sendUpdatedPopulatedFriendRequestMiddleware
];
