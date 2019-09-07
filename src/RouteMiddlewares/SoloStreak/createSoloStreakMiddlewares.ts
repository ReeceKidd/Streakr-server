import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import moment from "moment-timezone";
import * as mongoose from "mongoose";

import { AgendaTimeRanges } from "../../Agenda/agenda";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";

import { User } from "../../Models/User";
import { SoloStreak, soloStreakModel } from "../../Models/SoloStreak";
import { ResponseCodes } from "../../Server/responseCodes";
import { dayFormat } from "../CompleteTask/createCompleteTaskMiddlewares";
import { CustomError, ErrorType } from "../../customError";

export interface SoloStreakRegistrationRequestBody {
  userId: string;
  name: string;
  description: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface SoloStreakResponseLocals {
  user?: User;
  newSoloStreak?: SoloStreak;
  savedSoloStreak?: SoloStreak;
}

const createSoloStreakBodyValidationSchema = {
  userId: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string()
};

export const createSoloStreakBodyValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  Joi.validate(
    request.body,
    createSoloStreakBodyValidationSchema,
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
    next(new CustomError(ErrorType.DefineCurrentTimeMiddleware, err));
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
    next(new CustomError(ErrorType.DefineStartDayMiddleware, err));
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
    next(new CustomError(ErrorType.DefineEndOfDayMiddleware, err));
  }
};

export const defineEndOfDayMiddleware = getDefineEndOfDayMiddleware(
  AgendaTimeRanges.day
);

export const getCreateSoloStreakFromRequestMiddleware = (
  soloStreak: mongoose.Model<SoloStreak>
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { timezone } = response.locals;
    const { name, description, userId } = request.body;
    response.locals.newSoloStreak = new soloStreak({
      name,
      description,
      userId,
      timezone
    });
    next();
  } catch (err) {
    next(new CustomError(ErrorType.CreateSoloStreakFromRequestMiddleware, err));
  }
};

export const createSoloStreakFromRequestMiddleware = getCreateSoloStreakFromRequestMiddleware(
  soloStreakModel
);

export const saveSoloStreakToDatabaseMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const newSoloStreak: SoloStreak = response.locals.newSoloStreak;
    response.locals.savedSoloStreak = await newSoloStreak.save();
    next();
  } catch (err) {
    next(new CustomError(ErrorType.SaveSoloStreakToDatabaseMiddleware, err));
  }
};

export const sendFormattedSoloStreakMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { savedSoloStreak } = response.locals as SoloStreakResponseLocals;
    return response.status(ResponseCodes.created).send(savedSoloStreak);
  } catch (err) {
    next(new CustomError(ErrorType.SendFormattedSoloStreakMiddleware, err));
  }
};

export const createSoloStreakMiddlewares = [
  createSoloStreakBodyValidationMiddleware,
  defineCurrentTimeMiddleware,
  defineStartDayMiddleware,
  defineEndOfDayMiddleware,
  createSoloStreakFromRequestMiddleware,
  saveSoloStreakToDatabaseMiddleware,
  sendFormattedSoloStreakMiddleware
];
