import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import {
  completeGroupMemberStreakTaskModel,
  CompleteGroupMemberStreakTask
} from "../../Models/CompleteGroupMemberStreakTask";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

const completeGroupMemberStreakTaskParamsValidationSchema = {
  completeGroupMemberStreakTaskId: Joi.string().required()
};

export const completeGroupMemberStreakTaskParamsValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log(1);
  Joi.validate(
    request.params,
    completeGroupMemberStreakTaskParamsValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getDeleteCompleteGroupMemberStreakTaskMiddleware = (
  completeGroupMemberStreakTaskModel: mongoose.Model<
    CompleteGroupMemberStreakTask
  >
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    console.log(2);
    const { completeGroupMemberStreakTaskId } = request.params;
    console.log(request.params);
    const deletedCompleteGroupMemberStreakTask = await completeGroupMemberStreakTaskModel.findByIdAndDelete(
      completeGroupMemberStreakTaskId
    );
    if (!deletedCompleteGroupMemberStreakTask) {
      throw new CustomError(
        ErrorType.NoCompleteGroupMemberStreakTaskToDeleteFound
      );
    }
    response.locals.deletedCompleteGroupMemberStreakTask = deletedCompleteGroupMemberStreakTask;
    next();
  } catch (err) {
    console.log(err);
    if (err instanceof CustomError) next(err);
    else
      next(
        new CustomError(
          ErrorType.DeleteCompleteGroupMemberStreakTaskMiddleware,
          err
        )
      );
  }
};

export const deleteCompleteGroupMemberStreakTaskMiddleware = getDeleteCompleteGroupMemberStreakTaskMiddleware(
  completeGroupMemberStreakTaskModel
);

export const getSendCompleteGroupMemberStreakTaskDeletedResponseMiddleware = (
  successfulDeletetionResponseCode: ResponseCodes
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    console.log(3);
    return response.status(successfulDeletetionResponseCode).send();
  } catch (err) {
    next(
      new CustomError(
        ErrorType.SendCompleteGroupMemberStreakTaskDeletedResponseMiddleware,
        err
      )
    );
  }
};

export const sendCompleteGroupMemberStreakTaskDeletedResponseMiddleware = getSendCompleteGroupMemberStreakTaskDeletedResponseMiddleware(
  ResponseCodes.deleted
);

export const deleteCompleteGroupMemberStreakTaskMiddlewares = [
  completeGroupMemberStreakTaskParamsValidationMiddleware,
  deleteCompleteGroupMemberStreakTaskMiddleware,
  sendCompleteGroupMemberStreakTaskDeletedResponseMiddleware
];
