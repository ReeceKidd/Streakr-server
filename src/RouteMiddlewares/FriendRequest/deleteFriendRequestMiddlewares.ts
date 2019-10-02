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

export const getDeleteFriendRequestMiddleware = (
  friendRequestModel: mongoose.Model<FriendRequestModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { friendRequestId } = request.params;
    const deletedFriendRequest = await friendRequestModel.findByIdAndDelete(
      friendRequestId
    );
    if (!deletedFriendRequest) {
      throw new CustomError(ErrorType.NoFriendRequestToDeleteFound);
    }
    response.locals.deletedFriendRequest = deletedFriendRequest;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.DeleteFriendRequestMiddleware, err));
  }
};

export const deleteFriendRequestMiddleware = getDeleteFriendRequestMiddleware(
  friendRequestModel
);

export const getSendFriendRequestDeletedResponseMiddleware = (
  successfulDeletetionResponseCode: ResponseCodes
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    return response.status(successfulDeletetionResponseCode).send();
  } catch (err) {
    next(
      new CustomError(ErrorType.SendFriendRequestDeletedResponseMiddleware, err)
    );
  }
};

export const sendFriendRequestDeletedResponseMiddleware = getSendFriendRequestDeletedResponseMiddleware(
  ResponseCodes.deleted
);

export const deleteFriendRequestMiddlewares = [
  friendRequestParamsValidationMiddleware,
  deleteFriendRequestMiddleware,
  sendFriendRequestDeletedResponseMiddleware
];
