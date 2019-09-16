import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";

import { soloStreakModel, SoloStreakModel } from "../../Models/SoloStreak";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import { SoloStreak } from "@streakoid/streakoid-sdk/lib";

const createSoloStreakBodyValidationSchema = {
  userId: Joi.string().required(),
  streakName: Joi.string().required(),
  streakDescription: Joi.string(),
  numberOfMinutes: Joi.number().positive()
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

export const getCreateSoloStreakFromRequestMiddleware = (
  soloStreak: mongoose.Model<SoloStreakModel>
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { timezone } = response.locals;
    const {
      streakName,
      streakDescription,
      userId,
      numberOfMinutes
    } = request.body;
    response.locals.newSoloStreak = new soloStreak({
      streakName,
      streakDescription,
      userId,
      timezone,
      numberOfMinutes
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
    const newSoloStreak: SoloStreakModel = response.locals.newSoloStreak;
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
    const { savedSoloStreak } = response.locals;
    return response.status(ResponseCodes.created).send(savedSoloStreak);
  } catch (err) {
    next(new CustomError(ErrorType.SendFormattedSoloStreakMiddleware, err));
  }
};

export const createSoloStreakMiddlewares = [
  createSoloStreakBodyValidationMiddleware,
  createSoloStreakFromRequestMiddleware,
  saveSoloStreakToDatabaseMiddleware,
  sendFormattedSoloStreakMiddleware
];
