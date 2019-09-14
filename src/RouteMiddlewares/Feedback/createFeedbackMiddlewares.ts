import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { Feedback, feedbackModel } from "../../Models/Feedback";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

const createFeedbackBodyValidationSchema = {
  userId: Joi.string().required(),
  pageUrl: Joi.string().required(),
  username: Joi.string().required(),
  userEmail: Joi.string().required(),
  feedbackText: Joi.string().required()
};

export const createFeedbackBodyValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  Joi.validate(
    request.body,
    createFeedbackBodyValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getCreateFeedbackFromRequestMiddleware = (
  feedbackModel: mongoose.Model<Feedback>
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { userId, pageUrl, username, userEmail, feedbackText } = request.body;
    response.locals.newFeedback = new feedbackModel({
      userId,
      pageUrl,
      username,
      userEmail,
      feedbackText
    });
    next();
  } catch (err) {
    next(new CustomError(ErrorType.CreateFeedbackFromRequestMiddleware, err));
  }
};

export const createFeedbackFromRequestMiddleware = getCreateFeedbackFromRequestMiddleware(
  feedbackModel
);

export const saveFeedbackToDatabaseMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const newFeedback: Feedback = response.locals.newFeedback;
    response.locals.savedFeedback = await newFeedback.save();
    next();
  } catch (err) {
    next(new CustomError(ErrorType.SaveFeedbackToDatabaseMiddleware, err));
  }
};

export const sendFormattedFeedbackMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { savedFeedback } = response.locals;
    return response.status(ResponseCodes.created).send(savedFeedback);
  } catch (err) {
    next(new CustomError(ErrorType.SendFormattedFeedbackMiddleware, err));
  }
};

export const createFeedbackMiddlewares = [
  createFeedbackBodyValidationMiddleware,
  createFeedbackFromRequestMiddleware,
  saveFeedbackToDatabaseMiddleware,
  sendFormattedFeedbackMiddleware
];
