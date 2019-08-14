import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { completeTaskModel, CompleteTask } from "../../Models/CompleteTask";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

const completeTaskParamsValidationSchema = {
  completeTaskId: Joi.string().required()
};

export const completeTaskParamsValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log(request.params);
  Joi.validate(
    request.params,
    completeTaskParamsValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getDeleteCompleteTaskMiddleware = (
  completeTaskModel: mongoose.Model<CompleteTask>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { completeTaskId } = request.params;
    console.log(completeTaskId);
    const deletedCompleteTask = await completeTaskModel.findByIdAndDelete(
      completeTaskId
    );
    if (!deletedCompleteTask) {
      throw new CustomError(ErrorType.NoCompleteTaskToDeleteFound);
    }
    response.locals.deletedCompleteTask = deletedCompleteTask;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.DeleteCompleteTaskMiddleware, err));
  }
};

export const deleteCompleteTaskMiddleware = getDeleteCompleteTaskMiddleware(
  completeTaskModel
);

export const getSendCompleteTaskDeletedResponseMiddleware = (
  successfulDeletetionResponseCode: ResponseCodes
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    return response.status(successfulDeletetionResponseCode).send();
  } catch (err) {
    next(
      new CustomError(ErrorType.SendCompleteTaskDeletedResponseMiddleware, err)
    );
  }
};

export const sendCompleteTaskDeletedResponseMiddleware = getSendCompleteTaskDeletedResponseMiddleware(
  ResponseCodes.deleted
);

export const deleteCompleteTaskMiddlewares = [
  completeTaskParamsValidationMiddleware,
  deleteCompleteTaskMiddleware,
  sendCompleteTaskDeletedResponseMiddleware
];
