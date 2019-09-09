import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { groupStreakModel, GroupStreak } from "../../Models/GroupStreak";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import { User, userModel } from "../../Models/User";

const getGroupStreakParamsValidationSchema = {
  groupStreakId: Joi.string().required()
};

export const getGroupStreakParamsValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.params,
    getGroupStreakParamsValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getRetreiveGroupStreakMiddleware = (
  groupStreakModel: mongoose.Model<GroupStreak>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { groupStreakId } = request.params;
    const groupStreak = await groupStreakModel
      .findOne({ _id: groupStreakId })
      .lean();
    if (!groupStreak) {
      throw new CustomError(ErrorType.GetGroupStreakNoGroupStreakFound);
    }
    response.locals.groupStreak = groupStreak;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.RetreiveGroupStreakMiddleware, err));
  }
};

export const retreiveGroupStreakMiddleware = getRetreiveGroupStreakMiddleware(
  groupStreakModel
);

export const getRetreiveGroupStreakMembersInformationMiddleware = (
  userModel: mongoose.Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { groupStreak } = response.locals;
    const { members } = groupStreak;
    groupStreak.members = await Promise.all(
      members.map(async (member: string) => {
        return userModel.findOne({ _id: member }).lean();
      })
    );
    response.locals.groupStreakWithUsers = groupStreak;
    next();
  } catch (err) {
    next(new CustomError(ErrorType.RetreiveGroupStreakMembersInformation, err));
  }
};

export const retreiveGroupStreakMembersInformationMiddleware = getRetreiveGroupStreakMembersInformationMiddleware(
  userModel
);

export const getRetreiveCreatorInformationMiddleware = (
  userModel: mongoose.Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { groupStreak } = response.locals;
    const { creatorId } = groupStreak;
    const creator = await userModel.findOne({ _id: creatorId }).lean();
    groupStreak.creator = {
      _id: creator._id,
      username: creator.username
    };
    response.locals.groupStreak = groupStreak;
    next();
  } catch (err) {
    next(new CustomError(ErrorType.RetreiveGroupStreakMembersInformation, err));
  }
};

export const retreiveCreatorInformationMiddleware = getRetreiveCreatorInformationMiddleware(
  userModel
);

export const getSendGroupStreakMiddleware = (
  resourceCreatedResponseCode: number
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { groupStreak } = response.locals;
    console.log(groupStreak);
    return response
      .status(resourceCreatedResponseCode)
      .send({ ...groupStreak });
  } catch (err) {
    next(new CustomError(ErrorType.SendGroupStreakMiddleware, err));
  }
};

export const sendGroupStreakMiddleware = getSendGroupStreakMiddleware(
  ResponseCodes.success
);

export const getGroupStreakMiddlewares = [
  getGroupStreakParamsValidationMiddleware,
  retreiveGroupStreakMiddleware,
  retreiveGroupStreakMembersInformationMiddleware,
  retreiveCreatorInformationMiddleware,
  sendGroupStreakMiddleware
];
