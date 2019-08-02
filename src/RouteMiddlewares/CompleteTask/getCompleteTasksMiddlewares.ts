import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { completeTaskModel, CompleteTask } from "../../Models/CompleteTask";
import { CustomError, ErrorType } from "../../customError";
import { ResponseCodes } from "../../Server/responseCodes";

const completeTaskQueryValidationSchema = {
  userId: Joi.string(),
  streakId: Joi.string()
};

export const completeTaskQueryValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.query,
    completeTaskQueryValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getRetreiveCompleteTasksMiddleware = (
  completeTaskModel: mongoose.Model<CompleteTask>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { userId, streakId } = request.query;
    const completeTasks = await completeTaskModel.find({ userId, streakId });
    response.locals.completeTasks = completeTasks;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.GetCompleteTasksMiddleware, err));
  }
};

export const retreiveCompleteTasksMiddleware = getRetreiveCompleteTasksMiddleware(
  completeTaskModel
);

export const sendCompleteTasksResponseMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { completeTasks } = response.locals;
    return response.status(ResponseCodes.success).send({ completeTasks });
  } catch (err) {
    next(new CustomError(ErrorType.SendCompleteTasksResponseMiddleware, err));
  }
};

export const getCompleteTasksMiddlewares = [
  completeTaskQueryValidationMiddleware,
  retreiveCompleteTasksMiddleware,
  sendCompleteTasksResponseMiddleware
];
