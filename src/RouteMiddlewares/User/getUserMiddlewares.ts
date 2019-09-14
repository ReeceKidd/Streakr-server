import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { userModel, User } from "../../Models/User";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

const userParamsValidationSchema = {
  userId: Joi.string()
    .required()
    .length(24)
};

export const userParamsValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.params,
    userParamsValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getRetreiveUserMiddleware = (
  userModel: mongoose.Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { userId } = request.params;
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      throw new CustomError(ErrorType.NoUserFound);
    }
    response.locals.user = user;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.GetRetreiveUserMiddleware, err));
  }
};

export const retreiveUserMiddleware = getRetreiveUserMiddleware(userModel);

export const sendRetreiveUserResponseMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { user } = response.locals;
    return response.status(ResponseCodes.success).send(user);
  } catch (err) {
    next(new CustomError(ErrorType.SendRetreiveUserResponseMiddleware, err));
  }
};

export const getUserMiddlewares = [
  userParamsValidationMiddleware,
  retreiveUserMiddleware,
  sendRetreiveUserResponseMiddleware
];
