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
    const updatedFriendRequest = await friendRequestModel.findByIdAndUpdate(
      friendRequestId,
      { ...keysToUpdate },
      { new: true }
    );
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

export const sendUpdatedFriendRequestMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { updatedFriendRequest } = response.locals;
    return response.status(ResponseCodes.success).send(updatedFriendRequest);
  } catch (err) {
    next(new CustomError(ErrorType.SendUpdatedFriendRequestMiddleware, err));
  }
};

export const patchFriendRequestMiddlewares = [
  friendRequestParamsValidationMiddleware,
  friendRequestRequestBodyValidationMiddleware,
  patchFriendRequestMiddleware,
  sendUpdatedFriendRequestMiddleware
];
