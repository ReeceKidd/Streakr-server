import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import {
  completeSoloStreakTaskModel,
  CompleteSoloStreakTaskModel
} from "../../Models/CompleteSoloStreakTask";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

const completeSoloStreakTaskParamsValidationSchema = {
  completeSoloStreakTaskId: Joi.string().required()
};

export const completeSoloStreakTaskParamsValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.params,
    completeSoloStreakTaskParamsValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getDeleteCompleteSoloStreakTaskMiddleware = (
  completeSoloStreakTaskModel: mongoose.Model<CompleteSoloStreakTaskModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { completeSoloStreakTaskId } = request.params;
    const deletedCompleteSoloStreakTask = await completeSoloStreakTaskModel.findByIdAndDelete(
      completeSoloStreakTaskId
    );
    if (!deletedCompleteSoloStreakTask) {
      throw new CustomError(ErrorType.NoCompleteSoloStreakTaskToDeleteFound);
    }
    response.locals.deletedCompleteSoloStreakTask = deletedCompleteSoloStreakTask;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else
      next(
        new CustomError(ErrorType.DeleteCompleteSoloStreakTaskMiddleware, err)
      );
  }
};

export const deleteCompleteSoloStreakTaskMiddleware = getDeleteCompleteSoloStreakTaskMiddleware(
  completeSoloStreakTaskModel
);

export const getSendCompleteSoloStreakTaskDeletedResponseMiddleware = (
  successfulDeletetionResponseCode: ResponseCodes
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    return response.status(successfulDeletetionResponseCode).send();
  } catch (err) {
    next(
      new CustomError(
        ErrorType.SendCompleteSoloStreakTaskDeletedResponseMiddleware,
        err
      )
    );
  }
};

export const sendCompleteSoloStreakTaskDeletedResponseMiddleware = getSendCompleteSoloStreakTaskDeletedResponseMiddleware(
  ResponseCodes.deleted
);

export const deleteCompleteSoloStreakTaskMiddlewares = [
  completeSoloStreakTaskParamsValidationMiddleware,
  deleteCompleteSoloStreakTaskMiddleware,
  sendCompleteSoloStreakTaskDeletedResponseMiddleware
];
