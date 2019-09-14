import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import { Model } from "mongoose";
import { getValidationErrorMessageSenderMiddleware } from "../../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { User, userModel } from "../../../Models/User";
import { CustomError, ErrorType } from "../../../customError";
import { ResponseCodes } from "../../../Server/responseCodes";

const addFriendParamsValidationSchema = {
  userId: Joi.string()
    .required()
    .length(24)
};

export const addFriendParamsValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.params,
    addFriendParamsValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

const addFriendBodyValidationSchema = {
  friendId: Joi.string()
    .required()
    .length(24)
};

export const addFriendBodyValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  Joi.validate(
    request.body,
    addFriendBodyValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getRetreiveUserMiddleware = (userModel: Model<User>) => async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.params;
    const user = await userModel.findOne({ _id: userId }).lean();
    if (!user) {
      throw new CustomError(ErrorType.AddFriendUserDoesNotExist);
    }
    response.locals.user = user;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.AddFriendRetreiveUserMiddleware, err));
  }
};

export const retreiveUserMiddleware = getRetreiveUserMiddleware(userModel);

export const isAlreadyAFriendMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const user: User = response.locals.user;
    const { friendId } = request.body;

    const isExistingFriend = user.friends.find(friend => friend === friendId);
    if (isExistingFriend) {
      throw new CustomError(ErrorType.IsAlreadyAFriend);
    }
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.IsAlreadyAFriendMiddleware, err));
  }
};

export const getRetreiveFriendMiddleware = (userModel: Model<User>) => async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { friendId } = request.body;
    const friend = await userModel.findOne({ _id: friendId }).lean();
    if (!friend) {
      throw new CustomError(ErrorType.FriendDoesNotExist);
    }
    response.locals.friend = friend;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.DoesFriendExistMiddleware, err));
  }
};

export const retreiveFriendMiddleware = getRetreiveFriendMiddleware(userModel);

export const getAddFriendToUsersFriendListMiddleware = (
  userModel: Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { userId } = request.params;
    const { friendId } = request.body;
    const userWithNewFriend = await userModel.findByIdAndUpdate(
      userId,
      {
        $addToSet: { friends: friendId }
      },
      { new: true }
    );
    response.locals.userWithNewFriend = userWithNewFriend;
    next();
  } catch (err) {
    next(new CustomError(ErrorType.AddFriendToUsersFriendListMiddleware, err));
  }
};

export const addFriendToUsersFriendListMiddleware = getAddFriendToUsersFriendListMiddleware(
  userModel
);

export const sendUserWithNewFriendMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userWithNewFriend } = response.locals;
    return response.status(ResponseCodes.created).send(userWithNewFriend);
  } catch (err) {
    next(new CustomError(ErrorType.SendUserWithNewFriendMiddleware, err));
  }
};

export const addFriendMiddlewares = [
  addFriendParamsValidationMiddleware,
  addFriendBodyValidationMiddleware,
  retreiveUserMiddleware,
  isAlreadyAFriendMiddleware,
  retreiveFriendMiddleware,
  addFriendToUsersFriendListMiddleware,
  sendUserWithNewFriendMiddleware
];
