import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { userModel, UserModel } from "../../../Models/User";
import { CustomError, ErrorType } from "../../../customError";
import { ResponseCodes } from "../../../Server/responseCodes";

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
    const { friendId } = request.params;
    const user: UserModel = response.locals.user;
    console.log(user);
    const friend = user.friends.find((friend: string) => friend === friendId);
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
    const { userId, friendId } = request.params;
    const updatedUser = await userModel.findByIdAndUpdate(userId, {
      $pull: {
        friends: friendId
      }
    });
    response.locals.updatedUser = updatedUser;
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
    return response.status(ResponseCodes.deleted).send();
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
