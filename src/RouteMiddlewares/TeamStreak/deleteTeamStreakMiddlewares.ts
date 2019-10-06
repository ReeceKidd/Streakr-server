import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { teamStreakModel, TeamStreakModel } from "../../Models/TeamStreak";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

const TeamStreakParamsValidationSchema = {
  teamStreakId: Joi.string().required()
};

export const teamStreakParamsValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.params,
    TeamStreakParamsValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getDeleteTeamStreakMiddleware = (
  teamStreakModel: mongoose.Model<TeamStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { teamStreakId } = request.params;
    const deletedTeamStreak = await teamStreakModel.findByIdAndDelete(
      teamStreakId
    );
    if (!deletedTeamStreak) {
      throw new CustomError(ErrorType.NoTeamStreakToDeleteFound);
    }
    response.locals.deletedTeamStreak = deletedTeamStreak;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.DeleteTeamStreakMiddleware, err));
  }
};

export const deleteTeamStreakMiddleware = getDeleteTeamStreakMiddleware(
  teamStreakModel
);

export const getSendTeamStreakDeletedResponseMiddleware = (
  successfulDeletetionResponseCode: ResponseCodes
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    return response.status(successfulDeletetionResponseCode).send();
  } catch (err) {
    next(
      new CustomError(ErrorType.SendTeamStreakDeletedResponseMiddleware, err)
    );
  }
};

export const sendTeamStreakDeletedResponseMiddleware = getSendTeamStreakDeletedResponseMiddleware(
  ResponseCodes.deleted
);

export const deleteTeamStreakMiddlewares = [
  teamStreakParamsValidationMiddleware,
  deleteTeamStreakMiddleware,
  sendTeamStreakDeletedResponseMiddleware
];
