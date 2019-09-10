import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import {
  groupMemberStreakModel,
  GroupMemberStreak
} from "../../Models/GroupMemberStreak";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

const getGroupMemberStreakParamsValidationSchema = {
  groupMemberStreakId: Joi.string().required()
};

export const getGroupMemberStreakParamsValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.params,
    getGroupMemberStreakParamsValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getRetreiveGroupMemberStreakMiddleware = (
  groupMemberStreakModel: mongoose.Model<GroupMemberStreak>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { groupMemberStreakId } = request.params;
    const groupMemberStreak = await groupMemberStreakModel
      .findOne({ _id: groupMemberStreakId })
      .lean();
    if (!groupMemberStreak) {
      throw new CustomError(
        ErrorType.GetGroupMemberStreakNoGroupMemberStreakFound
      );
    }
    response.locals.groupMemberStreak = groupMemberStreak;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else
      next(new CustomError(ErrorType.RetreiveGroupMemberStreakMiddleware, err));
  }
};

export const retreiveGroupMemberStreakMiddleware = getRetreiveGroupMemberStreakMiddleware(
  groupMemberStreakModel
);

export const getSendGroupMemberStreakMiddleware = (
  resourceCreatedResponseCode: number
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { groupMemberStreak } = response.locals;
    return response
      .status(resourceCreatedResponseCode)
      .send({ ...groupMemberStreak });
  } catch (err) {
    next(new CustomError(ErrorType.SendGroupMemberStreakMiddleware, err));
  }
};

export const sendGroupMemberStreakMiddleware = getSendGroupMemberStreakMiddleware(
  ResponseCodes.success
);

export const getGroupMemberStreakMiddlewares = [
  getGroupMemberStreakParamsValidationMiddleware,
  retreiveGroupMemberStreakMiddleware,
  sendGroupMemberStreakMiddleware
];
