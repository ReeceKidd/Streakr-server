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

export const getDeleteSoloStreakMiddleware = (
  soloStreakModel: mongoose.Model<SoloStreak>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { soloStreakId } = request.params;
    const deletedSoloStreak = await soloStreakModel.findByIdAndDelete(
      soloStreakId
    );
    if (!deletedSoloStreak) {
      throw new CustomError(ErrorType.NoSoloStreakToDeleteFound);
    }
    response.locals.deletedSoloStreak = deletedSoloStreak;
    next();
  } catch (err) {
    return response.send(err);
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.DeleteSoloStreakMiddleware, err));
  }
};

export const deleteSoloStreakMiddleware = getDeleteSoloStreakMiddleware(
  soloStreakModel
);

export const getSendSoloStreakDeletedResponseMiddleware = (
  successfulDeletetionResponseCode: ResponseCodes
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    return response.status(successfulDeletetionResponseCode).send();
  } catch (err) {
    return response.send(err);
    next(
      new CustomError(ErrorType.SendSoloStreakDeletedResponseMiddleware, err)
    );
  }
};

export const sendSoloStreakDeletedResponseMiddleware = getSendSoloStreakDeletedResponseMiddleware(
  ResponseCodes.deleted
);

export const deleteSoloStreakMiddlewares = [
  soloStreakParamsValidationMiddleware,
  deleteSoloStreakMiddleware,
  sendSoloStreakDeletedResponseMiddleware
];
