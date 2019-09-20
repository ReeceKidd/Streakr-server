import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import {
  groupMemberStreakModel,
  GroupMemberStreakModel
} from "../../Models/GroupMemberStreak";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

const getGroupMemberStreaksQueryValidationSchema = {
  userId: Joi.string(),
  timezone: Joi.string(),
  completedToday: Joi.boolean(),
  active: Joi.boolean()
};

export const getGroupMemberStreaksQueryValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.query,
    getGroupMemberStreaksQueryValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getFindGroupMemberStreaksMiddleware = (
  groupMemberStreakModel: mongoose.Model<GroupMemberStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { userId, timezone, completedToday, active } = request.query;

    const query: {
      userId?: string;
      timezone?: string;
      completedToday?: boolean;
      active?: boolean;
    } = {};

    if (userId) {
      query.userId = userId;
    }
    if (timezone) {
      query.timezone = timezone;
    }
    if (completedToday) {
      query.completedToday = completedToday === "true";
    }
    if (active) {
      query.active = active === "true";
    }

    response.locals.groupMemberStreaks = await groupMemberStreakModel.find(
      query
    );
    next();
  } catch (err) {
    next(new CustomError(ErrorType.FindGroupMemberStreaksMiddleware, err));
  }
};

export const findGroupMemberStreaksMiddleware = getFindGroupMemberStreaksMiddleware(
  groupMemberStreakModel
);

export const sendGroupMemberStreaksMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { groupMemberStreaks } = response.locals;
    response.status(ResponseCodes.success).send(groupMemberStreaks);
  } catch (err) {
    next(new CustomError(ErrorType.SendGroupMemberStreaksMiddleware, err));
  }
};

export const getGroupMemberStreaksMiddlewares = [
  getGroupMemberStreaksQueryValidationMiddleware,
  findGroupMemberStreaksMiddleware,
  sendGroupMemberStreaksMiddleware
];
