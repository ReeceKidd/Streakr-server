import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import {
  completeSoloStreakTaskModel,
  CompleteSoloStreakTask
} from "../../Models/CompleteSoloStreakTask";
import { CustomError, ErrorType } from "../../customError";
import { ResponseCodes } from "../../Server/responseCodes";

const completeSoloStreakTaskQueryValidationSchema = {
  userId: Joi.string(),
  streakId: Joi.string()
};

export const completeSoloStreakTaskQueryValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.query,
    completeSoloStreakTaskQueryValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getRetreiveCompleteSoloStreakTasksMiddleware = (
  completeSoloStreakTaskModel: mongoose.Model<CompleteSoloStreakTask>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { userId, streakId } = request.query;
    const query: {
      userId?: string;
      streakId?: string;
    } = {};

    if (userId) {
      query.userId = userId;
    }
    if (streakId) {
      query.streakId = streakId;
    }

    response.locals.completeSoloStreakTasks = await completeSoloStreakTaskModel.find(
      query
    );
    next();
  } catch (err) {
    next(new CustomError(ErrorType.GetCompleteSoloStreakTasksMiddleware, err));
  }
};

export const retreiveCompleteSoloStreakTasksMiddleware = getRetreiveCompleteSoloStreakTasksMiddleware(
  completeSoloStreakTaskModel
);

export const sendCompleteSoloStreakTasksResponseMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { completeSoloStreakTasks } = response.locals;
    return response.status(ResponseCodes.success).send(completeSoloStreakTasks);
  } catch (err) {
    next(
      new CustomError(
        ErrorType.SendCompleteSoloStreakTasksResponseMiddleware,
        err
      )
    );
  }
};

export const getCompleteSoloStreakTasksMiddlewares = [
  completeSoloStreakTaskQueryValidationMiddleware,
  retreiveCompleteSoloStreakTasksMiddleware,
  sendCompleteSoloStreakTasksResponseMiddleware
];
