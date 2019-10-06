import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import {
  groupMemberStreakModel,
  GroupMemberStreakModel
} from "../../Models/GroupMemberStreak";
import { userModel, UserModel } from "../../Models/User";
import { TeamStreakModel, teamStreakModel } from "../../Models/teamStreak";

export interface TeamStreakRegistrationRequestBody {
  creatorId: string;
  streakName: string;
  streakDescription: string;
  numberOfMinutes: number;
  members: { memberId: string; groupMemberStreakId: string }[];
}

const member = Joi.object().keys({
  memberId: Joi.string().required(),
  groupMemberStreakId: Joi.string()
});

const createTeamStreakBodyValidationSchema = {
  creatorId: Joi.string().required(),
  streakName: Joi.string().required(),
  streakDescription: Joi.string(),
  numberOfMinutes: Joi.number().positive(),
  members: Joi.array()
    .min(1)
    .items(member)
};

export const createTeamStreakBodyValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  Joi.validate(
    request.body,
    createTeamStreakBodyValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getCreateTeamStreakMiddleware = (
  teamStreak: mongoose.Model<TeamStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { timezone } = response.locals;
    const {
      creatorId,
      teamStreakType,
      streakName,
      streakDescription,
      numberOfMinutes
    } = request.body;
    response.locals.newTeamStreak = await new teamStreak({
      creatorId,
      teamStreakType,
      streakName,
      streakDescription,
      numberOfMinutes,
      timezone
    }).save();
    next();
  } catch (err) {
    next(new CustomError(ErrorType.CreateTeamStreakMiddleware, err));
  }
};

export const createTeamStreakMiddleware = getCreateTeamStreakMiddleware(
  teamStreakModel
);

export const getCreateGroupMemberStreaksMiddleware = (
  userModel: mongoose.Model<UserModel>,
  groupMemberStreak: mongoose.Model<GroupMemberStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { timezone, newTeamStreak } = response.locals;
    const { members } = request.body;

    const membersWithGroupMemberStreakIds = await Promise.all(
      members.map(async (member: { memberId: string }) => {
        const memberExists = await userModel.findOne({ _id: member.memberId });
        if (!memberExists) {
          throw new CustomError(ErrorType.GroupMemberDoesNotExist);
        }

        const newGroupMemberStreak = await new groupMemberStreak({
          userId: member.memberId,
          teamStreakId: newTeamStreak._id,
          timezone
        }).save();

        return {
          memberId: member.memberId,
          groupMemberStreakId: newGroupMemberStreak._id
        };
      })
    );

    response.locals.membersWithGroupMemberStreakIds = membersWithGroupMemberStreakIds;

    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    next(
      new CustomError(
        ErrorType.CreateTeamStreakCreateMemberStreakMiddleware,
        err
      )
    );
  }
};

export const createGroupMemberStreaksMiddleware = getCreateGroupMemberStreaksMiddleware(
  userModel,
  groupMemberStreakModel
);

export const getUpdateTeamStreakMembersArray = (
  teamStreak: mongoose.Model<TeamStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { membersWithGroupMemberStreakIds, newTeamStreak } = response.locals;

    response.locals.newTeamStreak = await teamStreak
      .findByIdAndUpdate(
        newTeamStreak._id,
        {
          members: membersWithGroupMemberStreakIds
        },
        { new: true }
      )
      .lean();

    next();
  } catch (err) {
    next(new CustomError(ErrorType.UpdateTeamStreakMembersArray, err));
  }
};

export const updateTeamStreakMembersArrayMiddleware = getUpdateTeamStreakMembersArray(
  teamStreakModel
);

export const getPopulateTeamStreakMembersInformationMiddleware = (
  userModel: mongoose.Model<UserModel>,
  groupMemberStreakModel: mongoose.Model<GroupMemberStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { newTeamStreak } = response.locals;
    const { members } = newTeamStreak;
    newTeamStreak.members = await Promise.all(
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
    response.locals.newTeamStreak = newTeamStreak;
    next();
  } catch (err) {
    next(new CustomError(ErrorType.PopulateTeamStreakMembersInformation, err));
  }
};

export const populateTeamStreakMembersInformationMiddleware = getPopulateTeamStreakMembersInformationMiddleware(
  userModel,
  groupMemberStreakModel
);

export const getRetreiveCreatedTeamStreakCreatorInformationMiddleware = (
  userModel: mongoose.Model<UserModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { newTeamStreak } = response.locals;
    const { creatorId } = newTeamStreak;
    const creator = await userModel.findOne({ _id: creatorId }).lean();
    newTeamStreak.creator = {
      _id: creator._id,
      username: creator.username
    };
    response.locals.newTeamStreak = newTeamStreak;
    next();
  } catch (err) {
    next(
      new CustomError(
        ErrorType.RetreiveCreatedTeamStreakCreatorInformationMiddleware,
        err
      )
    );
  }
};

export const retreiveCreatedTeamStreakCreatorInformationMiddleware = getRetreiveCreatedTeamStreakCreatorInformationMiddleware(
  userModel
);

export const sendTeamStreakMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { newTeamStreak } = response.locals;
    return response.status(ResponseCodes.created).send(newTeamStreak);
  } catch (err) {
    next(new CustomError(ErrorType.SendFormattedTeamStreakMiddleware, err));
  }
};

export const createTeamStreakMiddlewares = [
  createTeamStreakBodyValidationMiddleware,
  createTeamStreakMiddleware,
  createGroupMemberStreaksMiddleware,
  updateTeamStreakMembersArrayMiddleware,
  populateTeamStreakMembersInformationMiddleware,
  retreiveCreatedTeamStreakCreatorInformationMiddleware,
  sendTeamStreakMiddleware
];
