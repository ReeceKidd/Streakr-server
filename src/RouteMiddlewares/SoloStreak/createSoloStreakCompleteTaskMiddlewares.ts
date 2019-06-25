import { Request, Response, NextFunction } from "express";
import moment from "moment-timezone";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getLocalisedString } from "../../Messages/getLocalisedString";
import { MessageCategories } from "../../Messages/messageCategories";
import { FailureMessageKeys } from "../../Messages/failureMessages";
import { SupportedRequestHeaders } from "../../Server/headers";
import { ResponseCodes } from "../../Server/responseCodes";
import { userModel, User } from "../../Models/User";
import { soloStreakModel, SoloStreak } from "../../Models/SoloStreak";
import {
  completeTaskModel,
  TypesOfStreak,
  CompleteTask
} from "../../Models/CompleteTask";
import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { CustomError, ErrorType } from "../../customError";

export const soloStreakTaskCompleteParamsValidationSchema = {
  soloStreakId: Joi.string().required()
};

export const soloStreakTaskCompleteParamsValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.params,
    soloStreakTaskCompleteParamsValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getSoloStreakExistsMiddleware = (
  soloStreakModel: mongoose.Model<SoloStreak>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { soloStreakId } = request.params;
    const soloStreak = await soloStreakModel.findOne({ _id: soloStreakId });
    if (!soloStreak) {
      throw new CustomError(ErrorType.SoloStreakDoesNotExist);
    }
    response.locals.soloStreak = soloStreak;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.SoloStreakExistsMiddleware, err));
  }
};

export const soloStreakExistsMiddleware = getSoloStreakExistsMiddleware(
  soloStreakModel
);

export const getRetreiveTimezoneHeaderMiddleware = (
  timezoneHeader: SupportedRequestHeaders
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const timezone = request.header(timezoneHeader);
    if (!timezone) {
      throw new CustomError(ErrorType.MissingTimezoneHeader);
    }
    response.locals.timezone = timezone;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.RetreiveTimezoneHeaderMiddleware, err));
  }
};

export const retreiveTimezoneHeaderMiddleware = getRetreiveTimezoneHeaderMiddleware(
  SupportedRequestHeaders.xTimezone
);

export const getSendMissingTimezoneErrorResponseMiddleware = (
  unprocessableEntityCode: ResponseCodes,
  localisedErrorMessage: string
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { timezone } = response.locals;
    if (!timezone) {
      return response
        .status(unprocessableEntityCode)
        .send({ message: localisedErrorMessage });
    }
    next();
  } catch (err) {
    next(err);
  }
};

const localisedMissingTimezoneHeaderMessage = getLocalisedString(
  MessageCategories.failureMessages,
  FailureMessageKeys.missingTimezoneHeaderMessage
);

export const sendMissingTimezoneErrorResponseMiddleware = getSendMissingTimezoneErrorResponseMiddleware(
  ResponseCodes.unprocessableEntity,
  localisedMissingTimezoneHeaderMessage
);

export const getValidateTimezoneMiddleware = (isValidTimezone: Function) => (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { timezone } = response.locals;
    response.locals.validTimezone = isValidTimezone(timezone);
    next();
  } catch (err) {
    next(err);
  }
};

export const validateTimezoneMiddleware = getValidateTimezoneMiddleware(
  moment.tz.zone
);

export const getSendInvalidTimezoneErrorResponseMiddleware = (
  unprocessableEntityCode: number,
  localisedErrorMessage: string
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { validTimezone } = response.locals;
    if (!validTimezone) {
      return response
        .status(unprocessableEntityCode)
        .send({ message: localisedErrorMessage });
    }
    next();
  } catch (err) {
    next(err);
  }
};

const localisedInvalidTimezoneMessage = getLocalisedString(
  MessageCategories.failureMessages,
  FailureMessageKeys.invalidTimezoneMessage
);

export const sendInvalidTimezoneErrorResponseMiddleware = getSendInvalidTimezoneErrorResponseMiddleware(
  ResponseCodes.unprocessableEntity,
  localisedInvalidTimezoneMessage
);

export const getRetreiveUserMiddleware = (
  userModel: mongoose.Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { minimumUserData } = response.locals;
    const user = await userModel.findOne({ _id: minimumUserData._id }).lean();
    response.locals.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const retreiveUserMiddleware = getRetreiveUserMiddleware(userModel);

export const getSendUserDoesNotExistErrorMiddlware = (
  unprocessableEntityCode: number,
  localisedUserDoesNotExistErrorMessage: string
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { user } = response.locals;
    if (!user) {
      return response
        .status(unprocessableEntityCode)
        .send({ message: localisedUserDoesNotExistErrorMessage });
    }
    next();
  } catch (err) {
    next(err);
  }
};

const localisedUserDoesNotExistErrorMessage = getLocalisedString(
  MessageCategories.failureMessages,
  FailureMessageKeys.userDoesNotExistMessage
);

export const sendUserDoesNotExistErrorMiddleware = getSendUserDoesNotExistErrorMiddlware(
  ResponseCodes.unprocessableEntity,
  localisedUserDoesNotExistErrorMessage
);

export const getSetTaskCompleteTimeMiddleware = (moment: any) => (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { timezone } = response.locals;
    const taskCompleteTime = moment().tz(timezone);
    response.locals.taskCompleteTime = taskCompleteTime;
    next();
  } catch (err) {
    next(err);
  }
};

export const setTaskCompleteTimeMiddleware = getSetTaskCompleteTimeMiddleware(
  moment
);

export const getSetStreakStartDateMiddleware = (
  soloStreakModel: mongoose.Model<SoloStreak>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const soloStreak: SoloStreak = response.locals.soloStreak;
    const taskCompleteTime = response.locals.taskCompleteTime;
    if (!soloStreak.currentStreak.startDate) {
      const { soloStreakId } = request.params;
      await soloStreakModel.findByIdAndUpdate(soloStreakId, {
        currentStreak: { startDate: taskCompleteTime }
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const setStreakStartDateMiddleware = getSetStreakStartDateMiddleware(
  soloStreakModel
);

export const getSetDayTaskWasCompletedMiddleware = (dayFormat: string) => (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { taskCompleteTime } = response.locals;
    const taskCompleteDay = taskCompleteTime.format(dayFormat);
    response.locals.taskCompleteDay = taskCompleteDay;
    next();
  } catch (err) {
    next(err);
  }
};

export const dayFormat = "YYYY-MM-DD";

export const setDayTaskWasCompletedMiddleware = getSetDayTaskWasCompletedMiddleware(
  dayFormat
);

export const getHasTaskAlreadyBeenCompletedTodayMiddleware = (
  completeTaskModel: mongoose.Model<CompleteTask>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { soloStreakId } = request.params;
    const { taskCompleteDay, user } = response.locals;
    const taskAlreadyCompletedToday = await completeTaskModel.findOne({
      userId: user._id,
      streakId: soloStreakId,
      taskCompleteDay
    });
    response.locals.taskAlreadyCompletedToday = taskAlreadyCompletedToday;
    next();
  } catch (err) {
    next(err);
  }
};

export const hasTaskAlreadyBeenCompletedTodayMiddleware = getHasTaskAlreadyBeenCompletedTodayMiddleware(
  completeTaskModel
);

export const getSendTaskAlreadyCompletedTodayErrorMiddleware = (
  unprocessableEntityResponseCode: number,
  localisedTaskAlreadyCompletedTodayErrorMessage: string
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { taskAlreadyCompletedToday } = response.locals;
    if (taskAlreadyCompletedToday) {
      return response
        .status(unprocessableEntityResponseCode)
        .send({ message: localisedTaskAlreadyCompletedTodayErrorMessage });
    }
    next();
  } catch (err) {
    next(err);
  }
};

const localisedTaskAlreadyCompletedTodayErrorMessage = getLocalisedString(
  MessageCategories.failureMessages,
  FailureMessageKeys.taskAlreadyCompleted
);

export const sendTaskAlreadyCompletedTodayErrorMiddleware = getSendTaskAlreadyCompletedTodayErrorMiddleware(
  ResponseCodes.unprocessableEntity,
  localisedTaskAlreadyCompletedTodayErrorMessage
);

export const getCreateCompleteTaskDefinitionMiddleware = (
  streakType: string
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { soloStreakId } = request.params;
    const { taskCompleteTime, taskCompleteDay, user } = response.locals;
    const completeTaskDefinition = {
      userId: user._id,
      streakId: soloStreakId,
      taskCompleteTime: taskCompleteTime.toDate(),
      taskCompleteDay,
      streakType
    };
    response.locals.completeTaskDefinition = completeTaskDefinition;
    next();
  } catch (err) {
    next(err);
  }
};

export const createCompleteTaskDefinitionMiddleware = getCreateCompleteTaskDefinitionMiddleware(
  TypesOfStreak.soloStreak
);

export const getSaveTaskCompleteMiddleware = (
  completeTaskModel: mongoose.Model<CompleteTask>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { completeTaskDefinition } = response.locals;
    const completeTask = await new completeTaskModel(
      completeTaskDefinition
    ).save();
    response.locals.completeTask = completeTask;
    next();
  } catch (err) {
    next(err);
  }
};

export const saveTaskCompleteMiddleware = getSaveTaskCompleteMiddleware(
  completeTaskModel
);

export const getStreakMaintainedMiddleware = (
  soloStreakModel: mongoose.Model<SoloStreak>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { soloStreakId } = request.params;
    await soloStreakModel.updateOne(
      { _id: soloStreakId },
      { completedToday: true, $inc: { "currentStreak.numberOfDaysInARow": 1 } }
    );
    next();
  } catch (err) {
    next(err);
  }
};

export const streakMaintainedMiddleware = getStreakMaintainedMiddleware(
  soloStreakModel
);

export const getSendTaskCompleteResponseMiddleware = (
  resourceCreatedResponseCode: number
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { completeTask } = response.locals;
    return response.status(resourceCreatedResponseCode).send({ completeTask });
  } catch (err) {
    next(err);
  }
};

export const sendTaskCompleteResponseMiddleware = getSendTaskCompleteResponseMiddleware(
  ResponseCodes.created
);

export const createSoloStreakCompleteTaskMiddlewares = [
  soloStreakTaskCompleteParamsValidationMiddleware,
  soloStreakExistsMiddleware,
  retreiveTimezoneHeaderMiddleware,
  sendMissingTimezoneErrorResponseMiddleware,
  validateTimezoneMiddleware,
  sendInvalidTimezoneErrorResponseMiddleware,
  retreiveUserMiddleware,
  sendUserDoesNotExistErrorMiddleware,
  setTaskCompleteTimeMiddleware,
  setStreakStartDateMiddleware,
  setDayTaskWasCompletedMiddleware,
  hasTaskAlreadyBeenCompletedTodayMiddleware,
  sendTaskAlreadyCompletedTodayErrorMiddleware,
  createCompleteTaskDefinitionMiddleware,
  saveTaskCompleteMiddleware,
  streakMaintainedMiddleware,
  sendTaskCompleteResponseMiddleware
];
