import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import {
  streakTrackingEventModel,
  StreakTrackingEventModel
} from "../../Models/StreakTrackingEvent";
import { CustomError, ErrorType } from "../../customError";
import { ResponseCodes } from "../../Server/responseCodes";
import { StreakTrackingEvent } from "@streakoid/streakoid-sdk/lib";

const streakTrackingEventQueryValidationSchema = {
  type: Joi.string(),
  userId: Joi.string(),
  streakId: Joi.string()
};

export const streakTrackingEventQueryValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.query,
    streakTrackingEventQueryValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getRetreiveStreakTrackingEventsMiddleware = (
  streakTrackingEventModel: mongoose.Model<StreakTrackingEventModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const query: {
      type?: string;
      userId?: string;
      streakId?: string;
    } = {};

    const { type, userId, streakId } = request.query;
    if (type) {
      query.type = type;
    }
    if (userId) {
      query.userId = userId;
    }
    if (streakId) {
      query.streakId = streakId;
    }

    response.locals.streakTrackingEvents = await streakTrackingEventModel.find(
      query
    );

    next();
  } catch (err) {
    next(new CustomError(ErrorType.GetStreakTrackingEventsMiddleware, err));
  }
};

export const retreiveStreakTrackingEventsMiddleware = getRetreiveStreakTrackingEventsMiddleware(
  streakTrackingEventModel
);

export const sendStreakTrackingEventsResponseMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { streakTrackingEvents } = response.locals;
    return response.status(ResponseCodes.success).send(streakTrackingEvents);
  } catch (err) {
    next(
      new CustomError(ErrorType.SendStreakTrackingEventsResponseMiddleware, err)
    );
  }
};

export const getStreakTrackingEventsMiddlewares = [
  streakTrackingEventQueryValidationMiddleware,
  retreiveStreakTrackingEventsMiddleware,
  sendStreakTrackingEventsResponseMiddleware
];
