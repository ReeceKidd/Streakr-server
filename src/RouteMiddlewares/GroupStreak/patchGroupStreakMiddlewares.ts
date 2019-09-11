import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { groupStreakModel, GroupStreak } from "../../Models/GroupStreak";
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

const groupStreakBodyValidationSchema = {
  creatorId: Joi.string(),
  streakName: Joi.string(),
  streakDescription: Joi.string(),
  numberOfMinutes: Joi.number(),
  timezone: Joi.string()
};

export const groupStreakRequestBodyValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.body,
    groupStreakBodyValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

// Might be better to do an endpoint called groupStreak/:id/members/:id;
// Does that make sense? I think so? As it is the members of the group streak.
// That way you can just post to groupStreak/:id/members to add a friend
// Getting returns the member information and the group member streak
// Deleteing deletes the member from the group

// Create a new group member streak for each new member

// Make sure memberId, groupStreakMemberId is in the same format before performing the update.

export const getPatchGroupStreakMiddleware = (
  groupStreakModel: mongoose.Model<GroupStreak>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { groupStreakId } = request.params;
    const keysToUpdate = request.body;
    const updatedGroupStreak = await groupStreakModel.findByIdAndUpdate(
      groupStreakId,
      { ...keysToUpdate },
      { new: true }
    );
    if (!updatedGroupStreak) {
      throw new CustomError(ErrorType.UpdatedGroupStreakNotFound);
    }
    response.locals.updatedGroupStreak = updatedGroupStreak;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.PatchGroupStreakMiddleware, err));
  }
};

export const patchGroupStreakMiddleware = getPatchGroupStreakMiddleware(
  groupStreakModel
);

export const sendUpdatedGroupStreakMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { updatedGroupStreak } = response.locals;
    return response
      .status(ResponseCodes.success)
      .send({ groupStreak: updatedGroupStreak });
  } catch (err) {
    next(new CustomError(ErrorType.SendUpdatedGroupStreakMiddleware, err));
  }
};

export const patchGroupStreakMiddlewares = [
  groupStreakParamsValidationMiddleware,
  groupStreakRequestBodyValidationMiddleware,
  patchGroupStreakMiddleware,
  sendUpdatedGroupStreakMiddleware
];
