import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { userModel, UserModel } from "../../../Models/User";
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
  userModel: mongoose.Model<UserModel>
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

export const sendFriendsMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const friends = response.locals.user.friends;
    return response.status(ResponseCodes.success).send(friends);
  } catch (err) {
    next(new CustomError(ErrorType.SendFormattedFriendsMiddleware, err));
  }
};

export const getFriendsMiddlewares = [
  getFriendsParamsValidationMiddleware,
  retreiveUserMiddleware,
  sendFriendsMiddleware
];
