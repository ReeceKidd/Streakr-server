import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { User, userModel } from "../../../Models/User";
import { CustomError, ErrorType } from "../../../customError";
import { ResponseCodes } from "../../../Server/responseCodes";

export const minimumSeachQueryLength = 1;
export const maximumSearchQueryLength = 64;

const getFriendsParamsValidationSchema = {
  userId: Joi.string().required()
};

export const getFriendsParamsValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.params,
    getFriendsParamsValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getRetreiveUserMiddleware = (
  userModel: mongoose.Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { userId } = request.params;
    const user = await userModel.findOne({ _id: userId }).lean();
    if (!user) {
      throw new CustomError(ErrorType.GetFriendsUserDoesNotExist);
    }
    response.locals.user = user;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.GetFriendsRetreiveUserMiddleware, err));
  }
};

export const retreiveUserMiddleware = getRetreiveUserMiddleware(userModel);

export const getRetreiveFriendsMiddleware = (
  userModel: mongoose.Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { user } = response.locals;
    const { friends } = user;
    response.locals.friends = await userModel.find({ _id: friends });
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.RetreiveFriendsMiddleware, err));
  }
};

export const retreiveFriendsMiddleware = getRetreiveFriendsMiddleware(
  userModel
);

export const formatFriendsMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const friends: { _id: string; username: string }[] =
      response.locals.friends;
    response.locals.formattedFriends = friends.map(friend => {
      return {
        username: friend.username,
        _id: friend._id
      };
    });
    next();
  } catch (err) {
    next(new CustomError(ErrorType.FormatFriendsMiddleware, err));
  }
};

export const sendFormattedFriendsMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { formattedFriends } = response.locals;
    return response
      .status(ResponseCodes.success)
      .send({ friends: formattedFriends });
  } catch (err) {
    next(new CustomError(ErrorType.SendFormattedFriendsMiddleware, err));
  }
};

export const getFriendsMiddlewares = [
  getFriendsParamsValidationMiddleware,
  retreiveUserMiddleware,
  retreiveFriendsMiddleware,
  formatFriendsMiddleware,
  sendFormattedFriendsMiddleware
];
