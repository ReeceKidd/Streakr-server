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

// Does user exist middleware

// Does group Id exist middleware

export const getCreateGroupMemberStreakFromRequestMiddleware = (
  groupMemberStreak: mongoose.Model<GroupMemberStreak>
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { timezone } = response.locals;
    const { name, description, userId, numberOfMinutes } = request.body;
    response.locals.newGroupMemberStreak = new groupMemberStreak({
      name,
      description,
      userId,
      timezone,
      numberOfMinutes
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
  createGroupMemberStreakFromRequestMiddleware,
  saveGroupMemberStreakToDatabaseMiddleware,
  sendFormattedGroupMemberStreakMiddleware
];
