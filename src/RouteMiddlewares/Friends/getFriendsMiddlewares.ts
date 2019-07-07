import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { userModel, IMinimumUserData, User } from "../../Models/User";
import { getLocalisedString } from "../../Messages/getLocalisedString";
import { MessageCategories } from "../../Messages/messageCategories";
import { FailureMessageKeys } from "../../Messages/failureMessages";
import { ResponseCodes } from "../../Server/responseCodes";

const getFriendsValidationSchema = {
  userId: Joi.string().required()
};

export const getFriendsValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.params,
    getFriendsValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getRetreiveUserMiddleware = (
  userModel: mongoose.Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { userId } = request.params;
    const user = await userModel.findOne({ _id: userId });
    response.locals.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const retreiveUserMiddleware = getRetreiveUserMiddleware(userModel);

export const getUserExistsValidationMiddleware = (
  userDoesNotExistMessage: string
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { user } = response.locals;
    if (!user) {
      return response.status(ResponseCodes.badRequest).send({
        message: userDoesNotExistMessage
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};

const localisedUserDoesNotExistMessage = getLocalisedString(
  MessageCategories.failureMessages,
  FailureMessageKeys.userDoesNotExistMessage
);

export const userExistsValidationMiddleware = getUserExistsValidationMiddleware(
  localisedUserDoesNotExistMessage
);

export const getRetreiveFriendsMiddleware = (
  userModel: mongoose.Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { user } = response.locals;
    const { friends } = user;
    response.locals.friends = await Promise.all(
      friends.map((friendId: string) => {
        return userModel.findOne({ _id: friendId });
      })
    );
    next();
  } catch (err) {
    next(err);
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
    const { friends } = response.locals;
    const formattedFriends = friends.map((friend: User) => {
      return {
        username: friend.username
      };
    });
    response.locals.formattedFriends = formattedFriends;
    next();
  } catch (err) {
    next(err);
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
    next(err);
  }
};

export const getFriendsMiddlewares = [
  getFriendsValidationMiddleware,
  retreiveUserMiddleware,
  userExistsValidationMiddleware,
  retreiveFriendsMiddleware,
  formatFriendsMiddleware,
  sendFormattedFriendsMiddleware
];
