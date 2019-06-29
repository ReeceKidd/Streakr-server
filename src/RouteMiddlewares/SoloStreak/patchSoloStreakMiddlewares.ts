import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { soloStreakModel, SoloStreak } from "../../Models/SoloStreak";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

const soloStreakParamsValidationSchema = {
  soloStreakId: Joi.string().required()
};

export const soloStreakParamsValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.params,
    soloStreakParamsValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

const soloStreakBodyValidationSchema = {
  userId: Joi.string(),
  name: Joi.string(),
  description: Joi.string(),
  completedToday: Joi.boolean()
};

export const soloStreakRequestBodyValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.body,
    soloStreakBodyValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getPatchSoloStreakMiddleware = (
  soloStreakModel: mongoose.Model<SoloStreak>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { soloStreakId } = request.params;
    const keysToUpdate = request.body;
    const updatedSoloStreak = await soloStreakModel.findByIdAndUpdate(
      soloStreakId,
      { ...keysToUpdate },
      { new: true }
    );
    if (!updatedSoloStreak) {
      throw new CustomError(ErrorType.UpdatedSoloStreakNotFound);
    }
    response.locals.updatedSoloStreak = updatedSoloStreak;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.PatchSoloStreakMiddleware, err));
  }
};

export const patchSoloStreakMiddleware = getPatchSoloStreakMiddleware(
  soloStreakModel
);

export const getSendUpdatedSoloStreakMiddleware = (
  updatedResourceResponseCode: number
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { updatedSoloStreak } = response.locals;
    return response
      .status(updatedResourceResponseCode)
      .send({ data: updatedSoloStreak });
  } catch (err) {
    next(new CustomError(ErrorType.SendUpdatedSoloStreakMiddleware, err));
  }
};

export const sendUpdatedSoloStreakMiddleware = getSendUpdatedSoloStreakMiddleware(
  ResponseCodes.success
);

export const patchSoloStreakMiddlewares = [
  soloStreakParamsValidationMiddleware,
  soloStreakRequestBodyValidationMiddleware,
  patchSoloStreakMiddleware,
  sendUpdatedSoloStreakMiddleware
];
