import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import moment from "moment-timezone";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";

import { GroupStreak, groupStreakModel } from "../../Models/GroupStreak";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

export interface GroupStreakRegistrationRequestBody {
  creatorId: string;
  streakName: string;
  streakDescription: string;
  numberOfMinutes: number;
  members: string[];
}

const createGroupStreakBodyValidationSchema = {
  creatorId: Joi.string().required(),
  streakName: Joi.string().required(),
  streakDescription: Joi.string(),
  numberOfMinutes: Joi.number().positive(),
  members: Joi.array().min(1)
};

export const createGroupStreakBodyValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  Joi.validate(
    request.body,
    createGroupStreakBodyValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getCreateGroupStreakFromRequestMiddleware = (
  groupStreak: mongoose.Model<GroupStreak>
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { timezone } = response.locals;
    const {
      creatorId,
      streakName,
      streakDescription,
      numberOfMinutes,
      members
    } = request.body;
    response.locals.newGroupStreak = new groupStreak({
      creatorId,
      streakName,
      streakDescription,
      numberOfMinutes,
      members,
      timezone
    });
    next();
  } catch (err) {
    next(
      new CustomError(ErrorType.CreateGroupStreakFromRequestMiddleware, err)
    );
  }
};

export const createGroupStreakFromRequestMiddleware = getCreateGroupStreakFromRequestMiddleware(
  groupStreakModel
);

export const saveGroupStreakToDatabaseMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const newGroupStreak: GroupStreak = response.locals.newGroupStreak;
    response.locals.savedGroupStreak = await newGroupStreak.save();
    next();
  } catch (err) {
    next(new CustomError(ErrorType.SaveGroupStreakToDatabaseMiddleware, err));
  }
};

export const sendFormattedGroupStreakMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { savedGroupStreak } = response.locals;
    return response.status(ResponseCodes.created).send(savedGroupStreak);
  } catch (err) {
    next(new CustomError(ErrorType.SendFormattedGroupStreakMiddleware, err));
  }
};

export const createGroupStreakMiddlewares = [
  createGroupStreakBodyValidationMiddleware,
  createGroupStreakFromRequestMiddleware,
  saveGroupStreakToDatabaseMiddleware,
  sendFormattedGroupStreakMiddleware
];
