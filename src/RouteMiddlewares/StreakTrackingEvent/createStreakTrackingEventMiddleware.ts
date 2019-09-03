import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import {
  StreakTrackingEvent,
  streakTrackingEventModel
} from "../../Models/StreakTrackingEvent";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

export interface StreakTrackingEventRequestBody {
  type: StreakTrackingEvent;
  streakId: string;
  userId: string;
  createdAt: Date;
  modifiedAt: Date;
}

const createStreakTrackingEventBodyValidationSchema = {
  type: Joi.string().required(),
  streakId: Joi.string().required(),
  userId: Joi.string().required()
};

export const createStreakTrackingEventBodyValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  Joi.validate(
    request.body,
    createStreakTrackingEventBodyValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getSaveStreakTrackingEventToDatabaseMiddleware = (
  streakTrackingEvent: mongoose.Model<StreakTrackingEvent>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { type, streakId, userId } = request.body;
    const newStreakTrackingEvent = new streakTrackingEvent({
      type,
      streakId,
      userId
    });
    response.locals.savedStreakTrackingEvent = await newStreakTrackingEvent.save();
    next();
  } catch (err) {
    next(
      new CustomError(
        ErrorType.CreateStreakTrackingEventFromRequestMiddleware,
        err
      )
    );
  }
};

export const saveStreakTrackingEventToDatabaseMiddleware = getSaveStreakTrackingEventToDatabaseMiddleware(
  streakTrackingEventModel
);

export const sendFormattedStreakTrackingEventMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { savedStreakTrackingEvent } = response.locals;
    return response
      .status(ResponseCodes.created)
      .send(savedStreakTrackingEvent);
  } catch (err) {
    next(
      new CustomError(ErrorType.SendFormattedStreakTrackingEventMiddleware, err)
    );
  }
};

export const createStreakTrackingEventMiddlewares = [
  createStreakTrackingEventBodyValidationMiddleware,
  saveStreakTrackingEventToDatabaseMiddleware,
  sendFormattedStreakTrackingEventMiddleware
];
