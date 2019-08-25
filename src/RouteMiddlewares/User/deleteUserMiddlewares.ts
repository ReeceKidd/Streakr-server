import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import { User, userModel } from "../../Models/User";

const userParamsValidationSchema = {
  userId: Joi.string().required()
};

export const deleteUserParamsValidationMiddleware = (
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

export const getDeleteUserMiddleware = (
  userModel: mongoose.Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { userId } = request.params;
    const deletedUser = await userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new CustomError(ErrorType.NoUserToDeleteFound);
    }
    response.locals.deletedUser = deletedUser;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.DeleteUserMiddleware, err));
  }
};

export const deleteUserMiddleware = getDeleteUserMiddleware(userModel);

export const sendUserDeletedResponseMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    return response.status(ResponseCodes.deleted).send();
  } catch (err) {
    next(new CustomError(ErrorType.SendUserDeletedResponseMiddleware, err));
  }
};

export const deleteUserMiddlewares = [
  deleteUserParamsValidationMiddleware,
  deleteUserMiddleware,
  sendUserDeletedResponseMiddleware
];
