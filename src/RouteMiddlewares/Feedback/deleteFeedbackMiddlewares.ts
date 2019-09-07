import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { feedbackModel, Feedback } from "../../Models/Feedback";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

const feedbackParamsValidationSchema = {
  feedbackId: Joi.string().required()
};

export const feedbackParamsValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.params,
    feedbackParamsValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getDeleteFeedbackMiddleware = (
  feedbackModel: mongoose.Model<Feedback>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { feedbackId } = request.params;
    const deletedFeedback = await feedbackModel.findByIdAndDelete(feedbackId);
    if (!deletedFeedback) {
      throw new CustomError(ErrorType.NoFeedbackToDeleteFound);
    }
    response.locals.deletedFeedback = deletedFeedback;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.DeleteFeedbackMiddleware, err));
  }
};

export const deleteFeedbackMiddleware = getDeleteFeedbackMiddleware(
  feedbackModel
);

export const getSendFeedbackDeletedResponseMiddleware = (
  successfulDeletetionResponseCode: ResponseCodes
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    return response.status(successfulDeletetionResponseCode).send();
  } catch (err) {
    next(new CustomError(ErrorType.SendFeedbackDeletedResponseMiddleware, err));
  }
};

export const sendFeedbackDeletedResponseMiddleware = getSendFeedbackDeletedResponseMiddleware(
  ResponseCodes.deleted
);

export const deleteFeedbackMiddlewares = [
  feedbackParamsValidationMiddleware,
  deleteFeedbackMiddleware,
  sendFeedbackDeletedResponseMiddleware
];
