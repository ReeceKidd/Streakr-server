import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import {
  streakTrackingEventModel,
  StreakTrackingEvent
} from "../../Models/StreakTrackingEvent";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

const streakTrackingEventParamsValidationSchema = {
  streakTrackingEventId: Joi.string().required()
};

export const streakTrackingEventParamsValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.params,
    streakTrackingEventParamsValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getDeleteStreakTrackingEventMiddleware = (
  streakTrackingEventModel: mongoose.Model<StreakTrackingEvent>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    console.log(request.params);
    const { streakTrackingEventId } = request.params;
    const deletedStreakTrackingEvent = await streakTrackingEventModel.findByIdAndDelete(
      streakTrackingEventId
    );
    if (!deletedStreakTrackingEvent) {
      throw new CustomError(ErrorType.NoStreakTrackingEventToDeleteFound);
    }
    response.locals.deletedStreakTrackingEvent = deletedStreakTrackingEvent;
    next();
  } catch (err) {
    console.log(err);
    if (err instanceof CustomError) next(err);
    else
      next(new CustomError(ErrorType.DeleteStreakTrackingEventMiddleware, err));
  }
};

export const deleteStreakTrackingEventMiddleware = getDeleteStreakTrackingEventMiddleware(
  streakTrackingEventModel
);

export const getSendStreakTrackingEventDeletedResponseMiddleware = (
  successfulDeletetionResponseCode: ResponseCodes
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    return response.status(successfulDeletetionResponseCode).send();
  } catch (err) {
    next(
      new CustomError(
        ErrorType.SendStreakTrackingEventDeletedResponseMiddleware,
        err
      )
    );
  }
};

export const sendStreakTrackingEventDeletedResponseMiddleware = getSendStreakTrackingEventDeletedResponseMiddleware(
  ResponseCodes.deleted
);

export const deleteStreakTrackingEventMiddlewares = [
  streakTrackingEventParamsValidationMiddleware,
  deleteStreakTrackingEventMiddleware,
  sendStreakTrackingEventDeletedResponseMiddleware
];
