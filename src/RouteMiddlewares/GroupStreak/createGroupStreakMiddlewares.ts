import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import moment from "moment-timezone";
import * as mongoose from "mongoose";

import { AgendaTimeRanges } from "../../Agenda/agenda";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";

import { GroupStreak, groupStreakModel } from "../../Models/GroupStreak";
import { ResponseCodes } from "../../Server/responseCodes";
import { dayFormat } from "../CompleteTask/createCompleteTaskMiddlewares";
import { CustomError, ErrorType } from "../../customError";

export interface GroupStreakRegistrationRequestBody {
  creatorId: string;
  groupName: string;
  streakName: string;
  streakDescription: string;
  members: string[];
}

const createGroupStreakBodyValidationSchema = {
  creatorId: Joi.string().required(),
  groupName: Joi.string().required(),
  streakName: Joi.string().required(),
  streakDescription: Joi.string().required(),
  members: Joi.array().required()
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

export const getDefineCurrentTimeMiddleware = (moment: any) => (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { timezone } = response.locals;
    const currentTime = moment().tz(timezone);
    response.locals.currentTime = currentTime;
    next();
  } catch (err) {
    next(
      new CustomError(ErrorType.GroupStreakDefineCurrentTimeMiddleware, err)
    );
  }
};

export const defineCurrentTimeMiddleware = getDefineCurrentTimeMiddleware(
  moment
);

export const getDefineStartDayMiddleware = (dayFormat: string) => (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { currentTime } = response.locals;
    const startDay = currentTime.format(dayFormat);
    response.locals.startDay = startDay;
    next();
  } catch (err) {
    next(new CustomError(ErrorType.GroupStreakDefineStartDayMiddleware, err));
  }
};

export const defineStartDayMiddleware = getDefineStartDayMiddleware(dayFormat);

export const getDefineEndOfDayMiddleware = (dayTimeRange: string) => (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { currentTime } = response.locals;
    response.locals.endOfDay = currentTime.endOf(dayTimeRange).toDate();
    next();
  } catch (err) {
    next(new CustomError(ErrorType.GroupStreakDefineEndOfDayMiddleware, err));
  }
};

export const defineEndOfDayMiddleware = getDefineEndOfDayMiddleware(
  AgendaTimeRanges.day
);

export const getCreateGroupStreakFromRequestMiddleware = (
  groupStreak: mongoose.Model<GroupStreak>
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { timezone } = response.locals;
    const {
      creatorId,
      groupName,
      streakName,
      streakDescription,
      members
    } = request.body;
    response.locals.newGroupStreak = new groupStreak({
      creatorId,
      groupName,
      streakName,
      streakDescription,
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
  defineCurrentTimeMiddleware,
  defineStartDayMiddleware,
  defineEndOfDayMiddleware,
  createGroupStreakFromRequestMiddleware,
  saveGroupStreakToDatabaseMiddleware,
  sendFormattedGroupStreakMiddleware
];
