import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { userModel, User } from "../../Models/User";
import { getLocalisedString } from "../../Messages/getLocalisedString";
import { MessageCategories } from "../../Messages/messageCategories";
import { FailureMessageKeys } from "../../Messages/failureMessages";
import { SuccessMessageKeys } from "../../Messages/successMessages";
import { ResponseCodes } from "../../Server/responseCodes";
import { SupportedResponseHeaders } from "../../Server/headers";
import { RouteCategories, UserProperties } from "../../routeCategories";
import ApiVersions from "../../Server/versions";

const addFriendParamsValidationSchema = {
  userId: Joi.string().required()
};

export const addFriendParamsValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.params,
    addFriendParamsValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

const addFriendBodyValidationSchema = {
  friendId: Joi.string().required()
};

export const addFriendBodyValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.body,
    addFriendBodyValidationSchema,
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
) => (request: Request, response: Response, next: NextFunction) => {
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

export const getAddFriendMiddleware = (
  userModel: mongoose.Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { userId } = request.params;
    const { friendId } = request.body;
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { friends: friendId } }
    );
    response.locals.updatedUser = updatedUser;
    next();
  } catch (err) {
    next(err);
  }
};

export const addFriendMiddleware = getAddFriendMiddleware(userModel);

export const getRetreiveFriendsDetailsMiddleware = (
  userModel: mongoose.Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { updatedUser } = response.locals;
    const { friends } = updatedUser;
    response.locals.friends = await userModel.find({ _id: { $in: friends } });
    next();
  } catch (err) {
    next(err);
  }
};

export const retreiveFriendsDetailsMiddleware = getRetreiveFriendsDetailsMiddleware(
  userModel
);

export const formatFriendsMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { friends } = response.locals;
    response.locals.formattedFriends = friends.map((friend: User) => {
      return {
        username: friend.username
      };
    });
    next();
  } catch (err) {
    next(err);
  }
};

export const getDefineLocationPathMiddleware = (
  apiVersion: string,
  userCategory: string,
  friendsProperty: string
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { userId } = request.params;
    const { friendId } = request.body;
    response.locals.locationPath = `/${apiVersion}/${userCategory}/${userId}/${friendsProperty}/${friendId}`;
    next();
  } catch (err) {
    next(err);
  }
};

export const defineLocationPathMiddleware = getDefineLocationPathMiddleware(
  ApiVersions.v1,
  RouteCategories.users,
  UserProperties.friends
);

export const getSetLocationHeaderMiddleware = (locationHeader: string) => (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { locationPath } = response.locals;
    response.setHeader(locationHeader, locationPath);
    next();
  } catch (err) {
    next(err);
  }
};

export const setLocationHeaderMiddleware = getSetLocationHeaderMiddleware(
  SupportedResponseHeaders.location
);

export const getSendFriendAddedSuccessMessageMiddleware = (
  addFriendSuccessMessage: string
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { formattedFriends } = response.locals;
    response
      .status(ResponseCodes.created)
      .send({ message: addFriendSuccessMessage, friends: formattedFriends });
  } catch (err) {
    next(err);
  }
};

const localisedSuccessfullyAddedFriendMessage = getLocalisedString(
  MessageCategories.successMessages,
  SuccessMessageKeys.successfullyAddedFriend
);

export const sendFriendAddedSuccessMessageMiddleware = getSendFriendAddedSuccessMessageMiddleware(
  localisedSuccessfullyAddedFriendMessage
);

export const addFriendMiddlewares = [
  addFriendParamsValidationMiddleware,
  addFriendBodyValidationMiddleware,
  retreiveUserMiddleware,
  userExistsValidationMiddleware,
  addFriendMiddleware,
  retreiveFriendsDetailsMiddleware,
  formatFriendsMiddleware,
  defineLocationPathMiddleware,
  setLocationHeaderMiddleware,
  sendFriendAddedSuccessMessageMiddleware
];
