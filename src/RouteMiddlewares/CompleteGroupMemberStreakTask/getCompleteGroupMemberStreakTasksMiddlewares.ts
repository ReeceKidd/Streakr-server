import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import {
  completeGroupMemberStreakTaskModel,
  CompleteGroupMemberStreakTaskModel
} from "../../Models/CompleteGroupMemberStreakTask";
import { CustomError, ErrorType } from "../../customError";
import { ResponseCodes } from "../../Server/responseCodes";
import { CompleteGroupMemberStreakTask } from "@streakoid/streakoid-sdk/lib";

const completeGroupMemberStreakTaskQueryValidationSchema = {
  userId: Joi.string(),
  groupStreakId: Joi.string(),
  groupMemberStreakId: Joi.string()
};

export const completeGroupMemberStreakTaskQueryValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.query,
    completeGroupMemberStreakTaskQueryValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getRetreiveCompleteGroupMemberStreakTasksMiddleware = (
  completeGroupMemberStreakTaskModel: mongoose.Model<
    CompleteGroupMemberStreakTaskModel
  >
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { userId, groupStreakId, groupMemberStreakId } = request.query;

    const query: {
      userId?: string;
      groupStreakId?: string;
      groupMemberStreakId?: string;
    } = {};

    if (userId) {
      query.userId = userId;
    }
    if (groupStreakId) {
      query.groupStreakId = groupStreakId;
    }
    if (groupMemberStreakId) {
      query.groupMemberStreakId = groupMemberStreakId;
    }

    response.locals.completeGroupMemberStreakTasks = await completeGroupMemberStreakTaskModel.find(
      query
    );
    next();
  } catch (err) {
    next(
      new CustomError(
        ErrorType.GetCompleteGroupMemberStreakTasksMiddleware,
        err
      )
    );
  }
};

export const retreiveCompleteGroupMemberStreakTasksMiddleware = getRetreiveCompleteGroupMemberStreakTasksMiddleware(
  completeGroupMemberStreakTaskModel
);

export const sendCompleteGroupMemberStreakTasksResponseMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { completeGroupMemberStreakTasks } = response.locals;
    return response
      .status(ResponseCodes.success)
      .send(completeGroupMemberStreakTasks);
  } catch (err) {
    next(
      new CustomError(
        ErrorType.SendCompleteGroupMemberStreakTasksResponseMiddleware,
        err
      )
    );
  }
};

export const getCompleteGroupMemberStreakTasksMiddlewares = [
  completeGroupMemberStreakTaskQueryValidationMiddleware,
  retreiveCompleteGroupMemberStreakTasksMiddleware,
  sendCompleteGroupMemberStreakTasksResponseMiddleware
];
