import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { ResponseCodes } from "../../Server/responseCodes";

import { userModel, UserModel } from "../../Models/User";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { CustomError, ErrorType } from "../../customError";

import { TeamStreakModel, teamStreakModel } from "../../Models/teamStreak";
import {
  groupMemberStreakModel,
  GroupMemberStreakModel
} from "../../Models/GroupMemberStreak";

export const createGroupMemberParamsValidationSchema = {
  teamStreakId: Joi.string().required()
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

export const getTeamStreakExistsMiddleware = (
  teamStreakModel: mongoose.Model<TeamStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { teamStreakId } = request.params;
    const teamStreak = await teamStreakModel
      .findOne({
        _id: teamStreakId
      })
      .lean();
    if (!teamStreak) {
      throw new CustomError(ErrorType.CreateGroupMemberTeamStreakDoesNotExist);
    }
    response.locals.teamStreak = teamStreak;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else
      next(
        new CustomError(
          ErrorType.CreateGroupMemberTeamStreakExistsMiddleware,
          err
        )
      );
  }
};

export const teamStreakExistsMiddleware = getTeamStreakExistsMiddleware(
  teamStreakModel
);

export const getCreateGroupMemberStreakMiddleware = (
  groupMemberStreak: mongoose.Model<GroupMemberStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { timezone } = response.locals;
    const { teamStreakId } = request.params;
    const { friendId } = request.body;
    response.locals.groupMemberStreak = await new groupMemberStreak({
      userId: friendId,
      teamStreakId,
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

export const getAddFriendToTeamStreakMiddleware = (
  teamStreakModel: mongoose.Model<TeamStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { teamStreakId } = request.params;
    const { friendId } = request.body;
    const { teamStreak, groupMemberStreak } = response.locals;
    let { members } = teamStreak;
    members = [
      ...members,
      { memberId: friendId, groupMemberStreakId: groupMemberStreak._id }
    ];
    const updatedTeamStreak = await teamStreakModel
      .findByIdAndUpdate(
        teamStreakId,
        {
          members
        },
        { new: true }
      )
      .lean();
    response.locals.teamStreak = updatedTeamStreak;
    next();
  } catch (err) {
    next(new CustomError(ErrorType.AddFriendToTeamStreakMiddleware, err));
  }
};

export const addFriendToTeamStreakMiddleware = getAddFriendToTeamStreakMiddleware(
  teamStreakModel
);

export const sendCreateGroupMemberResponseMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { teamStreak } = response.locals;
    return response.status(ResponseCodes.created).send(teamStreak.members);
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
  teamStreakExistsMiddleware,
  createGroupMemberStreakMiddleware,
  addFriendToTeamStreakMiddleware,
  sendCreateGroupMemberResponseMiddleware
];
