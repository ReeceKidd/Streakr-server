import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { ResponseCodes } from "../../Server/responseCodes";

import { userModel, UserModel } from "../../Models/User";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { CustomError, ErrorType } from "../../customError";

import { groupStreakModel, GroupStreakModel } from "../../Models/GroupStreak";
import {
  groupMemberStreakModel,
  GroupMemberStreakModel
} from "../../Models/GroupMemberStreak";

export const createGroupMemberParamsValidationSchema = {
  groupStreakId: Joi.string().required()
};

export const createGroupMemberParamsValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.params,
    createGroupMemberParamsValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const createGroupMemberBodyValidationSchema = {
  friendId: Joi.string().required()
};

export const createGroupMemberBodyValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.body,
    createGroupMemberBodyValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getFriendExistsMiddleware = (
  userModel: mongoose.Model<UserModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { friendId } = request.body;
    const friend = await userModel
      .findOne({
        _id: friendId
      })
      .lean();
    if (!friend) {
      throw new CustomError(ErrorType.CreateGroupMemberFriendDoesNotExist);
    }
    response.locals.friend = friend;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else
      next(
        new CustomError(ErrorType.CreateGroupMemberFriendExistsMiddleware, err)
      );
  }
};

export const friendExistsMiddleware = getFriendExistsMiddleware(userModel);

export const getGroupStreakExistsMiddleware = (
  groupStreakModel: mongoose.Model<GroupStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { groupStreakId } = request.params;
    const groupStreak = await groupStreakModel
      .findOne({
        _id: groupStreakId
      })
      .lean();
    if (!groupStreak) {
      throw new CustomError(ErrorType.CreateGroupMemberGroupStreakDoesNotExist);
    }
    response.locals.groupStreak = groupStreak;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else
      next(
        new CustomError(
          ErrorType.CreateGroupMemberGroupStreakExistsMiddleware,
          err
        )
      );
  }
};

export const groupStreakExistsMiddleware = getGroupStreakExistsMiddleware(
  groupStreakModel
);

export const getCreateGroupMemberStreakMiddleware = (
  groupMemberStreak: mongoose.Model<GroupMemberStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { timezone } = response.locals;
    const { groupStreakId } = request.params;
    const { friendId } = request.body;
    response.locals.groupMemberStreak = await new groupMemberStreak({
      userId: friendId,
      groupStreakId,
      timezone
    }).save();
    next();
  } catch (err) {
    next(
      new CustomError(
        ErrorType.CreateGroupMemberCreateGroupMemberStreakMiddleware,
        err
      )
    );
  }
};

export const createGroupMemberStreakMiddleware = getCreateGroupMemberStreakMiddleware(
  groupMemberStreakModel
);

export const getAddFriendToGroupStreakMiddleware = (
  groupStreakModel: mongoose.Model<GroupStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { groupStreakId } = request.params;
    const { friendId } = request.body;
    const { groupStreak, groupMemberStreak } = response.locals;
    let { members } = groupStreak;
    members = [
      ...members,
      { memberId: friendId, groupMemberStreakId: groupMemberStreak._id }
    ];
    const updatedGroupStreak = await groupStreakModel
      .findByIdAndUpdate(
        groupStreakId,
        {
          members
        },
        { new: true }
      )
      .lean();
    response.locals.groupStreak = updatedGroupStreak;
    next();
  } catch (err) {
    next(new CustomError(ErrorType.AddFriendToGroupStreakMiddleware, err));
  }
};

export const addFriendToGroupStreakMiddleware = getAddFriendToGroupStreakMiddleware(
  groupStreakModel
);

export const sendCreateGroupMemberResponseMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { groupStreak } = response.locals;
    return response.status(ResponseCodes.created).send(groupStreak.members);
  } catch (err) {
    next(
      new CustomError(ErrorType.SendCreateGroupMemberResponseMiddleware, err)
    );
  }
};

export const createGroupMemberMiddlewares = [
  createGroupMemberParamsValidationMiddleware,
  createGroupMemberBodyValidationMiddleware,
  friendExistsMiddleware,
  groupStreakExistsMiddleware,
  createGroupMemberStreakMiddleware,
  addFriendToGroupStreakMiddleware,
  sendCreateGroupMemberResponseMiddleware
];
