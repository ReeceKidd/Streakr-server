import { Request, Response, NextFunction } from "express";
import moment from "moment-timezone";
import * as Joi from "joi";
import * as mongoose from "mongoose";

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

export const getValidateTimezoneMiddleware = (isValidTimezone: Function) => (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { timezone } = response.locals;
    const validTimezone = isValidTimezone(timezone);
    if (!validTimezone) {
      throw new CustomError(ErrorType.InvalidTimezone);
    }
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.ValidateTimezoneMiddleware, err));
  }
};

export const validateTimezoneMiddleware = getValidateTimezoneMiddleware(
  moment.tz.zone
);

export const getRetreiveUserMiddleware = (
  userModel: mongoose.Model<User>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { minimumUserData } = response.locals;
    const user = await userModel.findOne({ _id: minimumUserData._id }).lean();
    if (!user) {
      throw new CustomError(ErrorType.UserDoesNotExist);
    }
    response.locals.user = user;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.RetreiveUserMiddleware, err));
  }
};

export const retreiveUserMiddleware = getRetreiveUserMiddleware(userModel);

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
    next(new CustomError(ErrorType.SetTaskCompleteTimeMiddleware, err));
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
    next(new CustomError(ErrorType.SetStreakStartDateMiddleware, err));
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
    next(new CustomError(ErrorType.SetDayTaskWasCompletedMiddleware, err));
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
    if (taskAlreadyCompletedToday) {
      throw new CustomError(ErrorType.TaskAlreadyCompletedToday);
    }
    response.locals.taskAlreadyCompletedToday = taskAlreadyCompletedToday;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else
      next(
        new CustomError(
          ErrorType.HasTaskAlreadyBeenCompletedTodayMiddleware,
          err
        )
      );
  }
};

export const hasTaskAlreadyBeenCompletedTodayMiddleware = getHasTaskAlreadyBeenCompletedTodayMiddleware(
  completeTaskModel
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
    next(
      new CustomError(ErrorType.CreateCompleteTaskDefinitionMiddleware, err)
    );
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
    next(new CustomError(ErrorType.SaveTaskCompleteMiddleware, err));
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
    next(new CustomError(ErrorType.StreakMaintainedMiddleware, err));
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
    next(new CustomError(ErrorType.SendTaskCompleteResponseMiddleware, err));
  }
};

export const sendTaskCompleteResponseMiddleware = getSendTaskCompleteResponseMiddleware(
  ResponseCodes.created
);

export const createSoloStreakCompleteTaskMiddlewares = [
  soloStreakTaskCompleteParamsValidationMiddleware,
  soloStreakExistsMiddleware,
  retreiveTimezoneHeaderMiddleware,
  validateTimezoneMiddleware,
  retreiveUserMiddleware,
  setTaskCompleteTimeMiddleware,
  setStreakStartDateMiddleware,
  setDayTaskWasCompletedMiddleware,
  hasTaskAlreadyBeenCompletedTodayMiddleware,
  createCompleteTaskDefinitionMiddleware,
  saveTaskCompleteMiddleware,
  streakMaintainedMiddleware,
  sendTaskCompleteResponseMiddleware
];
