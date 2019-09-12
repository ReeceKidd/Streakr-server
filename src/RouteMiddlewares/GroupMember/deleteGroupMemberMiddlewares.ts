import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";

import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import { GroupStreak, groupStreakModel } from "../../Models/GroupStreak";

const groupMemberParamsValidationSchema = {
  groupStreakId: Joi.string().required(),
  memberId: Joi.string().required()
};

export const groupMemberParamsValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.params,
    groupMemberParamsValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getRetreiveGroupStreakMiddleware = (
  groupStreakModel: mongoose.Model<GroupStreak>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { groupStreakId } = request.params;
    const groupStreak = await groupStreakModel.findById(groupStreakId).lean();
    if (!groupStreak) {
      throw new CustomError(ErrorType.NoGroupStreakFound);
    }
    response.locals.groupStreak = groupStreak;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else
      next(
        new CustomError(
          ErrorType.DeleteGroupMemberRetreiveGroupStreakMiddleware,
          err
        )
      );
  }
};

export const retreiveGroupStreakMiddleware = getRetreiveGroupStreakMiddleware(
  groupStreakModel
);

export const retreiveGroupMemberMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { memberId } = request.params;
    const { groupStreak } = response.locals;
    const { members } = groupStreak;
    const member = members.find((member: { memberId: string }) => {
      return member.memberId === memberId;
    });
    if (!member) {
      throw new CustomError(ErrorType.NoGroupMemberFound);
    }
    response.locals.member = member;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.RetreiveGroupMemberMiddleware, err));
  }
};
export const getDeleteGroupMemberMiddleware = (
  groupStreakModel: mongoose.Model<GroupStreak>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { memberId, groupStreakId } = request.params;
    const { groupStreak } = response.locals;
    let { members } = groupStreak;
    members = members.filter((member: { memberId: string }) => {
      return member.memberId !== memberId;
    });
    await groupStreakModel
      .findByIdAndUpdate(groupStreakId, { members }, { new: true })
      .lean();
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.DeleteGroupMemberMiddleware, err));
  }
};

export const deleteGroupMemberMiddleware = getDeleteGroupMemberMiddleware(
  groupStreakModel
);

export const sendGroupMemberDeletedResponseMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    return response.status(ResponseCodes.deleted).send();
  } catch (err) {
    next(
      new CustomError(ErrorType.SendGroupMemberDeletedResponseMiddleware, err)
    );
  }
};

export const deleteGroupMemberMiddlewares = [
  groupMemberParamsValidationMiddleware,
  retreiveGroupStreakMiddleware,
  retreiveGroupMemberMiddleware,
  deleteGroupMemberMiddleware,
  sendGroupMemberDeletedResponseMiddleware
];
