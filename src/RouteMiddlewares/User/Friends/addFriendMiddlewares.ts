import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import { Model } from "mongoose";
import { getValidationErrorMessageSenderMiddleware } from "../../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { userModel, UserModel } from "../../../Models/User";
import { CustomError, ErrorType } from "../../../customError";
import { ResponseCodes } from "../../../Server/responseCodes";
import {
  FriendRequestModel,
  friendRequestModel
} from "../../../Models/FriendRequest";
import {
  FriendRequestStatus,
  FriendRequest,
  User,
  Friend
} from "@streakoid/streakoid-sdk/lib";

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

export const getRetreiveUserMiddleware = (
  userModel: Model<UserModel>
) => async (request: Request, response: Response, next: NextFunction) => {
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
    const friendId: string = request.body.friendId;

    const isExistingFriend = user.friends.find(
      friend => friend.friendId == friendId
    );
    if (isExistingFriend) {
      throw new CustomError(ErrorType.IsAlreadyAFriend);
    }
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.IsAlreadyAFriendMiddleware, err));
  }
};

export const getRetreiveFriendMiddleware = (
  userModel: Model<UserModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { friendId } = request.body;
    const friend: User = await userModel.findOne({ _id: friendId }).lean();
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

export const getRetreiveFriendRequestMiddleware = (
  friendRequestModel: Model<FriendRequestModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { userId } = request.params;
    const { friendId } = request.body;
    const friendRequest = await friendRequestModel
      .findOne({
        requesteeId: userId,
        requesterId: friendId,
        status: FriendRequestStatus.pending
      })
      .lean();
    if (!friendRequest) {
      throw new CustomError(ErrorType.FriendRequestDoesNotExist);
    }
    response.locals.friendRequest = friendRequest;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.RetreiveFriendRequestMiddleware, err));
  }
};

export const retreiveFriendRequestMiddleware = getRetreiveFriendRequestMiddleware(
  friendRequestModel
);

export const getAddFriendToUsersFriendListMiddleware = (
  userModel: Model<UserModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { userId } = request.params;
    const friend: User = response.locals.friend;
    const formattedFriend: Friend = {
      friendId: friend._id,
      username: friend.username
    };
    const userWithNewFriend = await userModel.findByIdAndUpdate(
      userId,
      {
        $addToSet: { friends: formattedFriend }
      },
      { new: true }
    );
    response.locals.updatedFriends = userWithNewFriend!.friends;
    next();
  } catch (err) {
    next(new CustomError(ErrorType.AddFriendToUsersFriendListMiddleware, err));
  }
};

export const addFriendToUsersFriendListMiddleware = getAddFriendToUsersFriendListMiddleware(
  userModel
);

export const getAddUserToFriendsFriendListMiddleware = (
  userModel: Model<UserModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const user: User = response.locals.user;
    const friend: User = response.locals.friend;
    const formattedUser: Friend = {
      friendId: user._id,
      username: user.username
    };
    await userModel.findByIdAndUpdate(
      friend._id,
      {
        $addToSet: { friends: formattedUser }
      },
      { new: true }
    );
    next();
  } catch (err) {
    console.log(err);
    next(new CustomError(ErrorType.AddUserToFriendsFriendListMiddleware, err));
  }
};

export const addUserToFriendsFriendListMiddleware = getAddUserToFriendsFriendListMiddleware(
  userModel
);

export const getUpdateFriendRequestStatusMiddleware = (
  friendRequestModel: Model<FriendRequestModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const friendRequest: FriendRequest = response.locals.friendRequest;
    const updatedFriendRequest = await friendRequestModel.findByIdAndUpdate(
      friendRequest._id,
      {
        $set: { status: FriendRequestStatus.accepted }
      },
      { new: true }
    );
    response.locals.updatedFriendRequest = updatedFriendRequest;
    next();
  } catch (err) {
    next(new CustomError(ErrorType.UpdateFriendRequestStatusMiddleware, err));
  }
};

export const updateFriendRequestStatusMiddleware = getUpdateFriendRequestStatusMiddleware(
  friendRequestModel
);

export const sendUserWithNewFriendMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { updatedFriends } = response.locals;
    return response.status(ResponseCodes.created).send(updatedFriends);
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
  retreiveFriendRequestMiddleware,
  addFriendToUsersFriendListMiddleware,
  addUserToFriendsFriendListMiddleware,
  updateFriendRequestStatusMiddleware,
  sendUserWithNewFriendMiddleware
];
