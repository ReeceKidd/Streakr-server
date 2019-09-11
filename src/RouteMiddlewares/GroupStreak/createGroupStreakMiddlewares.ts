import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";

import { GroupStreak, groupStreakModel } from "../../Models/GroupStreak";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import {
  groupMemberStreakModel,
  GroupMemberStreak
} from "../../Models/GroupMemberStreak";
import { User, userModel } from "../../Models/User";

export interface GroupStreakRegistrationRequestBody {
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

const createGroupStreakBodyValidationSchema = {
  creatorId: Joi.string().required(),
  streakName: Joi.string().required(),
  streakDescription: Joi.string(),
  numberOfMinutes: Joi.number().positive(),
  members: Joi.array()
    .min(1)
    .items(member)
};

export const createGroupStreakBodyValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  Joi.validate(
    request.body,
    createGroupStreakBodyValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getCreateGroupStreakMiddleware = (
  groupStreak: mongoose.Model<GroupStreak>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { timezone } = response.locals;
    const {
      creatorId,
      streakName,
      streakDescription,
      numberOfMinutes
    } = request.body;
    response.locals.newGroupStreak = await new groupStreak({
      creatorId,
      streakName,
      streakDescription,
      numberOfMinutes,
      timezone
    }).save();
    next();
  } catch (err) {
    next(new CustomError(ErrorType.CreateGroupStreakMiddleware, err));
  }
};

export const createGroupStreakMiddleware = getCreateGroupStreakMiddleware(
  groupStreakModel
);

export const getCreateGroupMemberStreaksMiddleware = (
  user: mongoose.Model<User>,
  groupMemberStreak: mongoose.Model<GroupMemberStreak>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { timezone, newGroupStreak } = response.locals;
    const { members } = request.body;

    const membersWithGroupMemberStreakIds = await Promise.all(
      members.map(async ({ memberId }: { memberId: string }) => {
        const memberExists = await user.findOne({ _id: memberId });
        if (!memberExists) {
          throw new CustomError(ErrorType.GroupMemberDoesNotExist);
        }

        const newGroupMemberStreak = await new groupMemberStreak({
          userId: memberId,
          groupStreakId: newGroupStreak._id,
          timezone
        }).save();

        return {
          memberId,
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
        ErrorType.CreateGroupStreakCreateMemberStreakMiddleware,
        err
      )
    );
  }
};

export const createGroupMemberStreaksMiddleware = getCreateGroupMemberStreaksMiddleware(
  userModel,
  groupMemberStreakModel
);

export const getUpdateGroupStreakMembersArray = (
  groupStreak: mongoose.Model<GroupStreak>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { membersWithGroupMemberStreakIds, newGroupStreak } = response.locals;

    response.locals.newGroupStreak = await groupStreak
      .findByIdAndUpdate(
        newGroupStreak._id,
        {
          members: membersWithGroupMemberStreakIds
        },
        { new: true }
      )
      .lean();

    next();
  } catch (err) {
    next(new CustomError(ErrorType.UpdateGroupStreakMembersArray, err));
  }
};

export const updateGroupStreakMembersArrayMiddleware = getUpdateGroupStreakMembersArray(
  groupStreakModel
);

export const sendGroupStreakMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { newGroupStreak } = response.locals;
    return response.status(ResponseCodes.created).send(newGroupStreak);
  } catch (err) {
    next(new CustomError(ErrorType.SendFormattedGroupStreakMiddleware, err));
  }
};

export const createGroupStreakMiddlewares = [
  createGroupStreakBodyValidationMiddleware,
  createGroupStreakMiddleware,
  createGroupMemberStreaksMiddleware,
  updateGroupStreakMembersArrayMiddleware,
  sendGroupStreakMiddleware
];
