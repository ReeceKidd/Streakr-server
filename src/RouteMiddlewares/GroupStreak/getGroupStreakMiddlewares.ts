import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { groupStreakModel, GroupStreakModel } from "../../Models/GroupStreak";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import { userModel, UserModel } from "../../Models/User";
import {
  groupMemberStreakModel,
  GroupMemberStreakModel
} from "../../Models/GroupMemberStreak";

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
  groupStreakModel: mongoose.Model<GroupStreakModel>
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
  userModel: mongoose.Model<UserModel>,
  groupMemberStreakModel: mongoose.Model<GroupMemberStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { groupStreak } = response.locals;
    const { members } = groupStreak;
    groupStreak.members = await Promise.all(
      members.map(
        async (member: { memberId: string; groupMemberStreakId: string }) => {
          const [memberInfo, groupMemberStreak] = await Promise.all([
            userModel.findOne({ _id: member.memberId }).lean(),
            groupMemberStreakModel
              .findOne({ _id: member.groupMemberStreakId })
              .lean()
          ]);
          return {
            _id: memberInfo._id,
            username: memberInfo.username,
            groupMemberStreak
          };
        }
      )
    );

    response.locals.groupStreak = groupStreak;
    next();
  } catch (err) {
    next(new CustomError(ErrorType.RetreiveGroupStreakMembersInformation, err));
  }
};

export const retreiveGroupStreakMembersInformationMiddleware = getRetreiveGroupStreakMembersInformationMiddleware(
  userModel,
  groupMemberStreakModel
);

export const getRetreiveGroupStreakCreatorInformationMiddleware = (
  userModel: mongoose.Model<UserModel>
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
    next(
      new CustomError(
        ErrorType.RetreiveGroupStreakCreatorInformationMiddleware,
        err
      )
    );
  }
};

export const retreiveGroupStreakCreatorInformationMiddleware = getRetreiveGroupStreakCreatorInformationMiddleware(
  userModel
);

export const getSendGroupStreakMiddleware = (
  resourceCreatedResponseCode: number
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { groupStreak } = response.locals;
    return response.status(resourceCreatedResponseCode).send(groupStreak);
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
  retreiveGroupStreakCreatorInformationMiddleware,
  sendGroupStreakMiddleware
];
