import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { TeamStreakModel, teamStreakModel } from "../../Models/teamStreak";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import { userModel, UserModel } from "../../Models/User";
import {
  groupMemberStreakModel,
  GroupMemberStreakModel
} from "../../Models/GroupMemberStreak";

const getTeamStreakParamsValidationSchema = {
  teamStreakId: Joi.string().required()
};

export const getTeamStreakParamsValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.params,
    getTeamStreakParamsValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getRetreiveTeamStreakMiddleware = (
  teamStreakModel: mongoose.Model<TeamStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { teamStreakId } = request.params;
    const teamStreak = await teamStreakModel
      .findOne({ _id: teamStreakId })
      .lean();
    if (!teamStreak) {
      throw new CustomError(ErrorType.GetTeamStreakNoTeamStreakFound);
    }
    response.locals.teamStreak = teamStreak;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.RetreiveTeamStreakMiddleware, err));
  }
};

export const retreiveTeamStreakMiddleware = getRetreiveTeamStreakMiddleware(
  teamStreakModel
);

export const getRetreiveTeamStreakMembersInformationMiddleware = (
  userModel: mongoose.Model<UserModel>,
  groupMemberStreakModel: mongoose.Model<GroupMemberStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { teamStreak } = response.locals;
    const { members } = teamStreak;
    teamStreak.members = await Promise.all(
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

    response.locals.teamStreak = teamStreak;
    next();
  } catch (err) {
    next(new CustomError(ErrorType.RetreiveTeamStreakMembersInformation, err));
  }
};

export const retreiveTeamStreakMembersInformationMiddleware = getRetreiveTeamStreakMembersInformationMiddleware(
  userModel,
  groupMemberStreakModel
);

export const getRetreiveTeamStreakCreatorInformationMiddleware = (
  userModel: mongoose.Model<UserModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { teamStreak } = response.locals;
    const { creatorId } = teamStreak;
    const creator = await userModel.findOne({ _id: creatorId }).lean();
    teamStreak.creator = {
      _id: creator._id,
      username: creator.username
    };
    response.locals.teamStreak = teamStreak;
    next();
  } catch (err) {
    next(
      new CustomError(
        ErrorType.RetreiveTeamStreakCreatorInformationMiddleware,
        err
      )
    );
  }
};

export const retreiveTeamStreakCreatorInformationMiddleware = getRetreiveTeamStreakCreatorInformationMiddleware(
  userModel
);

export const getSendTeamStreakMiddleware = (
  resourceCreatedResponseCode: number
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { teamStreak } = response.locals;
    return response.status(resourceCreatedResponseCode).send(teamStreak);
  } catch (err) {
    next(new CustomError(ErrorType.SendTeamStreakMiddleware, err));
  }
};

export const sendTeamStreakMiddleware = getSendTeamStreakMiddleware(
  ResponseCodes.success
);

export const getOneTeamStreakMiddlewares = [
  getTeamStreakParamsValidationMiddleware,
  retreiveTeamStreakMiddleware,
  retreiveTeamStreakMembersInformationMiddleware,
  retreiveTeamStreakCreatorInformationMiddleware,
  sendTeamStreakMiddleware
];
