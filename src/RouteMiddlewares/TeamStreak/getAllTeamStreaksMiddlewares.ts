import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";
import PopulatedTeamStreak from "@streakoid/streakoid-sdk/lib/models/PopulatedTeamStreak";
import PopulatedMember from "@streakoid/streakoid-sdk/lib/models/PopulatedMember";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { TeamStreakModel, teamStreakModel } from "../../Models/teamStreak";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import { userModel, UserModel } from "../../Models/User";
import {
  groupMemberStreakModel,
  GroupMemberStreakModel
} from "../../Models/GroupMemberStreak";
import StreakStatus from "@streakoid/streakoid-sdk/lib/StreakStatus";

const getTeamStreaksQueryValidationSchema = {
  creatorId: Joi.string(),
  memberId: Joi.string(),
  timezone: Joi.string(),
  status: Joi.string().valid(Object.keys(StreakStatus))
};

export const getTeamStreaksQueryValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.query,
    getTeamStreaksQueryValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getFindTeamStreaksMiddleware = (
  teamStreakModel: mongoose.Model<TeamStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { creatorId, memberId, timezone, status } = request.query;
    const query: any = {};

    if (creatorId) {
      query.creatorId = creatorId;
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

    response.locals.teamStreaks = await teamStreakModel.find(query).lean();
    next();
  } catch (err) {
    next(new CustomError(ErrorType.FindTeamStreaksMiddleware, err));
  }
};

export const findTeamStreaksMiddleware = getFindTeamStreaksMiddleware(
  teamStreakModel
);

export const getRetreiveTeamStreaksMembersInformationMiddleware = (
  userModel: mongoose.Model<UserModel>,
  groupMemberStreakModel: mongoose.Model<GroupMemberStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { teamStreaks } = response.locals;
    const teamStreaksWithPopulatedData = await Promise.all(
      teamStreaks.map(
        async (teamStreak: any): Promise<PopulatedTeamStreak> => {
          const { members } = teamStreak;
          teamStreak.members = await Promise.all(
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

          return teamStreak;
        }
      )
    );
    response.locals.teamStreaks = teamStreaksWithPopulatedData;
    next();
  } catch (err) {
    next(new CustomError(ErrorType.RetreiveTeamStreaksMembersInformation, err));
  }
};

export const retreiveTeamStreaksMembersInformationMiddleware = getRetreiveTeamStreaksMembersInformationMiddleware(
  userModel,
  groupMemberStreakModel
);

export const sendTeamStreaksMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { teamStreaks } = response.locals;
    response.status(ResponseCodes.success).send(teamStreaks);
  } catch (err) {
    next(new CustomError(ErrorType.SendTeamStreaksMiddleware, err));
  }
};

export const getAllTeamStreaksMiddlewares = [
  getTeamStreaksQueryValidationMiddleware,
  findTeamStreaksMiddleware,
  retreiveTeamStreaksMembersInformationMiddleware,
  sendTeamStreaksMiddleware
];
