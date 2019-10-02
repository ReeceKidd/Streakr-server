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

    response.locals.friendRequests = await friendRequestModel.find(query);
    next();
  } catch (err) {
    next(new CustomError(ErrorType.FindFriendRequestsMiddleware, err));
  }
};

export const findFriendRequestsMiddleware = getFindFriendRequestsMiddleware(
  friendRequestModel
);

export const sendFriendRequestsMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { friendRequests } = response.locals;
    response.status(ResponseCodes.success).send(friendRequests);
  } catch (err) {
    next(new CustomError(ErrorType.SendFriendRequestsMiddleware, err));
  }
};

export const getAllFriendRequestsMiddlewares = [
  getFriendRequestsQueryValidationMiddleware,
  findFriendRequestsMiddleware,
  sendFriendRequestsMiddleware
];
