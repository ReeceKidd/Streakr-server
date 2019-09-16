import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { groupStreakModel, GroupStreakModel } from "../../Models/GroupStreak";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

const groupStreakParamsValidationSchema = {
  groupStreakId: Joi.string().required()
};

export const groupStreakParamsValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.params,
    groupStreakParamsValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getDeleteGroupStreakMiddleware = (
  groupStreakModel: mongoose.Model<GroupStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { groupStreakId } = request.params;
    const deletedGroupStreak = await groupStreakModel.findByIdAndDelete(
      groupStreakId
    );
    if (!deletedGroupStreak) {
      throw new CustomError(ErrorType.NoGroupStreakToDeleteFound);
    }
    response.locals.deletedGroupStreak = deletedGroupStreak;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.DeleteGroupStreakMiddleware, err));
  }
};

export const deleteGroupStreakMiddleware = getDeleteGroupStreakMiddleware(
  groupStreakModel
);

export const getSendGroupStreakDeletedResponseMiddleware = (
  successfulDeletetionResponseCode: ResponseCodes
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    return response.status(successfulDeletetionResponseCode).send();
  } catch (err) {
    next(
      new CustomError(ErrorType.SendGroupStreakDeletedResponseMiddleware, err)
    );
  }
};

export const sendGroupStreakDeletedResponseMiddleware = getSendGroupStreakDeletedResponseMiddleware(
  ResponseCodes.deleted
);

export const deleteGroupStreakMiddlewares = [
  groupStreakParamsValidationMiddleware,
  deleteGroupStreakMiddleware,
  sendGroupStreakDeletedResponseMiddleware
];
