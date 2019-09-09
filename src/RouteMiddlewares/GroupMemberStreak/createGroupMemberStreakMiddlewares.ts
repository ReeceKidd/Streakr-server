import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import moment from "moment-timezone";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";

import {
  GroupMemberStreak,
  groupMemberStreakModel
} from "../../Models/GroupMemberStreak";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import { User, userModel } from "../../Models/User";

export interface GroupMemberStreakRegistrationRequestBody {
  userId: string;
  groupStreakId: string;
}

const createGroupMemberStreakBodyValidationSchema = {
  userId: Joi.string().required(),
  groupStreakId: Joi.string().required()
};

export const createGroupMemberStreakBodyValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  Joi.validate(
    request.body,
    createGroupMemberStreakBodyValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getRetreiveUserMiddleware = (
  userModel: mongoose.Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { userId } = request.body;
    const user = await userModel.findOne({ _id: userId }).lean();
    if (!user) {
      throw new CustomError(ErrorType.CreateGroupMemberStreakUserDoesNotExist);
    }
    response.locals.user = user;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else
      next(
        new CustomError(
          ErrorType.CreateGroupMemberStreakRetreiveUserMiddleware,
          err
        )
      );
  }
};

export const retreiveUserMiddleware = getRetreiveUserMiddleware(userModel);

// Does group Id exist middleware

export const getCreateGroupMemberStreakFromRequestMiddleware = (
  groupMemberStreak: mongoose.Model<GroupMemberStreak>
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { timezone } = response.locals;
    const { userId, groupStreakId } = request.body;
    response.locals.newGroupMemberStreak = new groupMemberStreak({
      userId,
      groupStreakId,
      timezone
    });
    next();
  } catch (err) {
    next(
      new CustomError(
        ErrorType.CreateGroupMemberStreakFromRequestMiddleware,
        err
      )
    );
  }
};

export const createGroupMemberStreakFromRequestMiddleware = getCreateGroupMemberStreakFromRequestMiddleware(
  groupMemberStreakModel
);

export const saveGroupMemberStreakToDatabaseMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const newGroupMemberStreak: GroupMemberStreak =
      response.locals.newGroupMemberStreak;
    response.locals.savedGroupMemberStreak = await newGroupMemberStreak.save();
    next();
  } catch (err) {
    next(
      new CustomError(ErrorType.SaveGroupMemberStreakToDatabaseMiddleware, err)
    );
  }
};

export const sendFormattedGroupMemberStreakMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { savedGroupMemberStreak } = response.locals;
    return response.status(ResponseCodes.created).send(savedGroupMemberStreak);
  } catch (err) {
    next(
      new CustomError(ErrorType.SendFormattedGroupMemberStreakMiddleware, err)
    );
  }
};

export const createGroupMemberStreakMiddlewares = [
  createGroupMemberStreakBodyValidationMiddleware,
  retreiveUserMiddleware,
  createGroupMemberStreakFromRequestMiddleware,
  saveGroupMemberStreakToDatabaseMiddleware,
  sendFormattedGroupMemberStreakMiddleware
];
