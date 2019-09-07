import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { agendaJobModel, AgendaJob } from "../../Models/AgendaJob";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

const agendaJobParamsValidationSchema = {
  agendaJobId: Joi.string().required()
};

export const agendaJobParamsValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.params,
    agendaJobParamsValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getDeleteAgendaJobMiddleware = (
  agendaJobModel: mongoose.Model<AgendaJob>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { agendaJobId } = request.params;
    const deletedAgendaJob = await agendaJobModel.findByIdAndDelete(
      agendaJobId
    );
    if (!deletedAgendaJob) {
      throw new CustomError(ErrorType.NoAgendaJobToDeleteFound);
    }
    response.locals.deletedAgendaJob = deletedAgendaJob;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.DeleteAgendaJobMiddleware, err));
  }
};

export const deleteAgendaJobMiddleware = getDeleteAgendaJobMiddleware(
  agendaJobModel
);

export const getSendAgendaJobDeletedResponseMiddleware = (
  successfulDeletetionResponseCode: ResponseCodes
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    return response.status(successfulDeletetionResponseCode).send();
  } catch (err) {
    next(
      new CustomError(ErrorType.SendAgendaJobDeletedResponseMiddleware, err)
    );
  }
};

export const sendAgendaJobDeletedResponseMiddleware = getSendAgendaJobDeletedResponseMiddleware(
  ResponseCodes.deleted
);

export const deleteAgendaJobMiddlewares = [
  agendaJobParamsValidationMiddleware,
  deleteAgendaJobMiddleware,
  sendAgendaJobDeletedResponseMiddleware
];
