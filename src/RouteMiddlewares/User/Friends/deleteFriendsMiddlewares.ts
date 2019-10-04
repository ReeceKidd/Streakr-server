import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { userModel, UserModel } from "../../../Models/User";
import { CustomError, ErrorType } from "../../../customError";
import { ResponseCodes } from "../../../Server/responseCodes";
import { User } from "@streakoid/streakoid-sdk/lib";
import { resolve } from "path";

const deleteFriendParamsValidationSchema = {
  userId: Joi.string()
    .required()
    .length(24),
  friendId: Joi.string()
    .required()
    .length(24)
};

export const deleteFriendParamsValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.params,
    deleteFriendParamsValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getRetreiveUserMiddleware = (
  userModel: mongoose.Model<UserModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { userId } = request.params;
    const user = await userModel.findOne({ _id: userId }).lean();
    if (!user) {
      throw new CustomError(ErrorType.DeleteUserNoUserFound);
    }
    response.locals.user = user;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.DeleteUserRetreiveUserMiddleware, err));
  }
};

export const retreiveUserMiddleware = getRetreiveUserMiddleware(userModel);

export const doesFriendExistMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const friendId: string = request.params.friendId;
    const user: User = response.locals.user;
    const friend = user.friends.find(friend => friend.friendId == friendId);
    if (!friend) {
      throw new CustomError(ErrorType.DeleteUserFriendDoesNotExist);
    }
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else
      next(
        new CustomError(ErrorType.DeleteFriendDoesFriendExistMiddleware, err)
      );
  }
};

export const getDeleteFriendMiddleware = (
  userModel: mongoose.Model<UserModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const user: User = response.locals.user;
    const { friends } = user;
    const { userId, friendId } = request.params;
    const updatedFriends = friends.filter(
      friend => friend.friendId != friendId
    );
    await userModel
      .findByIdAndUpdate(userId, {
        $set: {
          friends: updatedFriends
        }
      })
      .lean();
    response.locals.updatedFriends = updatedFriends;
    next();
  } catch (err) {
    next(new CustomError(ErrorType.DeleteFriendMiddleware, err));
  }
};

export const deleteFriendMiddleware = getDeleteFriendMiddleware(userModel);

export const sendFriendDeletedResponseMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { updatedFriends } = response.locals;
    return response.status(ResponseCodes.success).send(updatedFriends);
  } catch (err) {
    next(new CustomError(ErrorType.SendUserDeletedResponseMiddleware, err));
  }
};

export const deleteFriendMiddlewares = [
  deleteFriendParamsValidationMiddleware,
  retreiveUserMiddleware,
  doesFriendExistMiddleware,
  deleteFriendMiddleware,
  sendFriendDeletedResponseMiddleware
];
