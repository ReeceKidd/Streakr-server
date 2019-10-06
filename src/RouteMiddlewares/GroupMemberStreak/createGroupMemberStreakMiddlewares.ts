import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";

import {
  groupMemberStreakModel,
  GroupMemberStreakModel
} from "../../Models/GroupMemberStreak";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import { userModel, UserModel } from "../../Models/User";
import { TeamStreakModel, teamStreakModel } from "../../Models/TeamStreak";

export interface GroupMemberStreakRegistrationRequestBody {
  userId: string;
  teamStreakId: string;
}

const createGroupMemberStreakBodyValidationSchema = {
  userId: Joi.string().required(),
  teamStreakId: Joi.string().required()
};

export const createGroupMemberStreakBodyValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  Joi.validate(
    request.body,
    createGroupMemberStreakBodyValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getRetreiveUserMiddleware = (
  userModel: mongoose.Model<UserModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { userId } = request.body;
    const user = await userModel.findOne({ _id: userId }).lean();
    if (!user) {
      throw new CustomError(ErrorType.CreateGroupMemberStreakUserDoesNotExist);
    }
    response.locals.user = user;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else
      next(
        new CustomError(
          ErrorType.CreateGroupMemberStreakRetreiveUserMiddleware,
          err
        )
      );
  }
};

export const retreiveUserMiddleware = getRetreiveUserMiddleware(userModel);

export const getRetreiveTeamStreakMiddleware = (
  teamStreakModel: mongoose.Model<TeamStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { teamStreakId } = request.body;
    const teamStreak = await teamStreakModel.findOne({ _id: teamStreakId });
    if (!teamStreak) {
      throw new CustomError(
        ErrorType.CreateGroupMemberStreakTeamStreakDoesNotExist
      );
    }
    response.locals.teamStreak = teamStreak;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else
      next(
        new CustomError(
          ErrorType.CreateGroupMemberStreakRetreiveTeamStreakMiddleware,
          err
        )
      );
  }
};

export const retreiveTeamStreakMiddleware = getRetreiveTeamStreakMiddleware(
  teamStreakModel
);

export const getCreateGroupMemberStreakFromRequestMiddleware = (
  groupMemberStreak: mongoose.Model<GroupMemberStreakModel>
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { timezone } = response.locals;
    const { userId, teamStreakId } = request.body;
    response.locals.newGroupMemberStreak = new groupMemberStreak({
      userId,
      teamStreakId,
      timezone
    });
    next();
  } catch (err) {
    next(
      new CustomError(
        ErrorType.CreateGroupMemberStreakFromRequestMiddleware,
        err
      )
    );
  }
};

export const createGroupMemberStreakFromRequestMiddleware = getCreateGroupMemberStreakFromRequestMiddleware(
  groupMemberStreakModel
);

export const saveGroupMemberStreakToDatabaseMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const newGroupMemberStreak: GroupMemberStreakModel =
      response.locals.newGroupMemberStreak;
    response.locals.savedGroupMemberStreak = await newGroupMemberStreak.save();
    next();
  } catch (err) {
    next(
      new CustomError(ErrorType.SaveGroupMemberStreakToDatabaseMiddleware, err)
    );
  }
};

export const sendFormattedGroupMemberStreakMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { savedGroupMemberStreak } = response.locals;
    return response.status(ResponseCodes.created).send(savedGroupMemberStreak);
  } catch (err) {
    next(
      new CustomError(ErrorType.SendFormattedGroupMemberStreakMiddleware, err)
    );
  }
};

export const createGroupMemberStreakMiddlewares = [
  createGroupMemberStreakBodyValidationMiddleware,
  retreiveUserMiddleware,
  retreiveTeamStreakMiddleware,
  createGroupMemberStreakFromRequestMiddleware,
  saveGroupMemberStreakToDatabaseMiddleware,
  sendFormattedGroupMemberStreakMiddleware
];
