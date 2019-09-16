import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import {
  streakTrackingEventModel,
  StreakTrackingEventModel
} from "../../Models/StreakTrackingEvent";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import { StreakTrackingEvent } from "@streakoid/streakoid-sdk/lib";

const getStreakTrackingEventParamsValidationSchema = {
  streakTrackingEventId: Joi.string().required()
};

export const getStreakTrackingEventParamsValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.params,
    getStreakTrackingEventParamsValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getRetreiveStreakTrackingEventMiddleware = (
  streakTrackingEventModel: mongoose.Model<StreakTrackingEventModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { streakTrackingEventId } = request.params;
    const streakTrackingEvent = await streakTrackingEventModel
      .findOne({ _id: streakTrackingEventId })
      .lean();
    if (!streakTrackingEvent) {
      throw new CustomError(
        ErrorType.GetStreakTrackingEventNoStreakTrackingEventFound
      );
    }
    response.locals.streakTrackingEvent = streakTrackingEvent;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else
      next(
        new CustomError(ErrorType.RetreiveStreakTrackingEventMiddleware, err)
      );
  }
};

export const retreiveStreakTrackingEventMiddleware = getRetreiveStreakTrackingEventMiddleware(
  streakTrackingEventModel
);

export const getSendStreakTrackingEventMiddleware = (
  resourceCreatedResponseCode: number
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { streakTrackingEvent } = response.locals;
    return response
      .status(resourceCreatedResponseCode)
      .send(streakTrackingEvent);
  } catch (err) {
    next(new CustomError(ErrorType.SendStreakTrackingEventMiddleware, err));
  }
};

export const sendStreakTrackingEventMiddleware = getSendStreakTrackingEventMiddleware(
  ResponseCodes.success
);

export const getStreakTrackingEventMiddlewares = [
  getStreakTrackingEventParamsValidationMiddleware,
  retreiveStreakTrackingEventMiddleware,
  sendStreakTrackingEventMiddleware
];
