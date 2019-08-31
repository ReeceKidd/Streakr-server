import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { groupStreakModel, GroupStreak } from "../../Models/GroupStreak";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import { User, userModel } from "../../Models/User";

const getGroupStreaksQueryValidationSchema = {
  creatorId: Joi.string(),
  memberId: Joi.string(),
  timezone: Joi.string()
};

export const getGroupStreaksQueryValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.query,
    getGroupStreaksQueryValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getFindGroupStreaksMiddleware = (
  groupStreakModel: mongoose.Model<GroupStreak>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { memberId, timezone, creatorId } = request.query;

    const query: {
      creatorId?: string;
      members?: string;
      timezone?: string;
    } = {};

    if (creatorId) {
      query.creatorId = creatorId;
    }
    if (memberId) {
      query.members = memberId;
    }
    if (timezone) {
      query.timezone = timezone;
    }

    response.locals.groupStreaks = await groupStreakModel.find(query).lean();
    next();
  } catch (err) {
    next(new CustomError(ErrorType.FindGroupStreaksMiddleware, err));
  }
};

export const findGroupStreaksMiddleware = getFindGroupStreaksMiddleware(
  groupStreakModel
);

export const getRetreiveGroupStreaksMembersInformationMiddleware = (
  userModel: mongoose.Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { groupStreaks } = response.locals;
    const groupStreaksWithUsers = await Promise.all(
      groupStreaks.map(async (groupStreak: any) => {
        const { members } = groupStreak;

        return {
          ...groupStreak,
          members: await Promise.all(
            members.map(async (member: string) => {
              return userModel.findOne({ _id: member }).lean();
            })
          )
        };
      })
    );
    response.locals.groupStreaksWithUsers = groupStreaksWithUsers;
    next();
  } catch (err) {
    next(
      new CustomError(ErrorType.RetreiveGroupStreaksMembersInformation, err)
    );
  }
};

export const retreiveGroupStreaksMembersInformationMiddleware = getRetreiveGroupStreaksMembersInformationMiddleware(
  userModel
);

export const sendGroupStreaksMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { groupStreaksWithUsers } = response.locals;
    response
      .status(ResponseCodes.success)
      .send({ groupStreaks: groupStreaksWithUsers });
  } catch (err) {
    next(new CustomError(ErrorType.SendGroupStreaksMiddleware, err));
  }
};

export const getGroupStreaksMiddlewares = [
  getGroupStreaksQueryValidationMiddleware,
  findGroupStreaksMiddleware,
  retreiveGroupStreaksMembersInformationMiddleware,
  sendGroupStreaksMiddleware
];
