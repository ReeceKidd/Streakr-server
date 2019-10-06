import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";
import PopulatedGroupStreak from "@streakoid/streakoid-sdk/lib/models/PopulatedGroupStreak";
import PopulatedMember from "@streakoid/streakoid-sdk/lib/models/PopulatedMember";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { groupStreakModel, GroupStreakModel } from "../../Models/GroupStreak";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import { userModel, UserModel } from "../../Models/User";
import {
  groupMemberStreakModel,
  GroupMemberStreakModel
} from "../../Models/GroupMemberStreak";
import { GroupStreakType } from "@streakoid/streakoid-sdk/lib";
import StreakStatus from "@streakoid/streakoid-sdk/lib/StreakStatus";

const getGroupStreaksQueryValidationSchema = {
  creatorId: Joi.string(),
  groupStreakType: Joi.string().valid(Object.keys(GroupStreakType)),
  memberId: Joi.string(),
  timezone: Joi.string(),
  status: Joi.string().valid(Object.keys(StreakStatus))
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
  groupStreakModel: mongoose.Model<GroupStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const {
      creatorId,
      groupStreakType,
      memberId,
      timezone,
      status
    } = request.query;
    const query: any = {};

    if (creatorId) {
      query.creatorId = creatorId;
    }
    if (groupStreakType) {
      query.groupStreakType = groupStreakType;
    }
    if (memberId) {
      query["members.memberId"] = memberId;
    }
    if (timezone) {
      query.timezone = timezone;
    }
    if (status) {
      query.status = status;
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
  userModel: mongoose.Model<UserModel>,
  groupMemberStreakModel: mongoose.Model<GroupMemberStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { groupStreaks } = response.locals;
    const groupStreaksWithPopulatedData = await Promise.all(
      groupStreaks.map(
        async (groupStreak: any): Promise<PopulatedGroupStreak> => {
          const { members } = groupStreak;
          groupStreak.members = await Promise.all(
            members.map(
              async (member: {
                memberId: string;
                groupMemberStreakId: string;
              }): Promise<PopulatedMember> => {
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

          return groupStreak;
        }
      )
    );
    response.locals.groupStreaks = groupStreaksWithPopulatedData;
    next();
  } catch (err) {
    next(
      new CustomError(ErrorType.RetreiveGroupStreaksMembersInformation, err)
    );
  }
};

export const retreiveGroupStreaksMembersInformationMiddleware = getRetreiveGroupStreaksMembersInformationMiddleware(
  userModel,
  groupMemberStreakModel
);

export const sendGroupStreaksMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { groupStreaks } = response.locals;
    response.status(ResponseCodes.success).send(groupStreaks);
  } catch (err) {
    next(new CustomError(ErrorType.SendGroupStreaksMiddleware, err));
  }
};

export const getAllGroupStreaksMiddlewares = [
  getGroupStreaksQueryValidationMiddleware,
  findGroupStreaksMiddleware,
  retreiveGroupStreaksMembersInformationMiddleware,
  sendGroupStreaksMiddleware
];
