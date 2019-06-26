import { ResponseCodes } from "./Server/responseCodes";

export enum ErrorType {
  InternalServerError,
  InvalidTimezone,
  UserDoesNotExist,
  PasswordDoesNotMatchHash,
  RetreiveUserWithEmailMiddlewareError,
  CompareRequestPasswordToUserHashedPasswordMiddleware,
  SetMinimumUserDataMiddleware,
  SetJsonWebTokenExpiryInfoMiddleware,
  SetJsonWebTokenMiddleware,
  LoginSuccessfulMiddleware,
  SoloStreakDoesNotExist,
  SoloStreakExistsMiddleware,
  MissingTimezoneHeader,
  RetreiveTimezoneHeaderMiddleware,
  ValidateTimezoneMiddleware,
  RetreiveUserMiddleware,
  SetTaskCompleteTimeMiddleware,
  SetStreakStartDateMiddleware,
  TaskAlreadyCompletedToday,
  HasTaskAlreadyBeenCompletedTodayMiddleware,
  CreateCompleteTaskDefinitionMiddleware,
  SaveTaskCompleteMiddleware,
  StreakMaintainedMiddleware,
  SendTaskCompleteResponseMiddleware,
  SetDayTaskWasCompletedMiddleware
}

const internalServerMessage = "Internal Server Error.";

export class CustomError extends Error {
  public code: string;
  public message: string;
  public httpStatusCode: ResponseCodes;

  constructor(type: ErrorType, ...params: any[]) {
    super(...params);
    const { code, message, httpStatusCode } = this.createCustomErrorData(type);
    this.code = code;
    this.message = message;
    this.httpStatusCode = httpStatusCode;
  }

  private createCustomErrorData(type: ErrorType) {
    switch (type) {
      case ErrorType.InvalidTimezone:
        return {
          code: `${ResponseCodes.badRequest}-01`,
          message: "Timezone is invalid.",
          httpStatusCode: ResponseCodes.badRequest
        };

      case ErrorType.UserDoesNotExist:
        return {
          code: `${ResponseCodes.badRequest}-02`,
          message: "User does not exist.",
          httpStatusCode: ResponseCodes.badRequest
        };

      case ErrorType.PasswordDoesNotMatchHash: {
        return {
          code: `${ResponseCodes.badRequest}-03`,
          message: "Password does not match hash.",
          httpStatusCode: ResponseCodes.badRequest
        };
      }

      case ErrorType.SoloStreakDoesNotExist: {
        return {
          code: `${ResponseCodes.badRequest}-04`,
          message: "Solo streak does not exist.",
          httpStatusCode: ResponseCodes.badRequest
        };
      }

      case ErrorType.MissingTimezoneHeader: {
        return {
          code: `${ResponseCodes.badRequest}-05`,
          message: "Missing x-timezone header.",
          httpStatusCode: ResponseCodes.badRequest
        };
      }

      case ErrorType.TaskAlreadyCompletedToday: {
        return {
          code: `${ResponseCodes.badRequest}-06`,
          message: "Task already completed today.",
          httpStatusCode: ResponseCodes.badRequest
        };
      }

      case ErrorType.RetreiveUserWithEmailMiddlewareError: {
        return {
          code: `${ResponseCodes.warning}-02`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };
      }

      case ErrorType.CompareRequestPasswordToUserHashedPasswordMiddleware: {
        return {
          code: `${ResponseCodes.warning}-03`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };
      }

      case ErrorType.SetMinimumUserDataMiddleware: {
        return {
          code: `${ResponseCodes.warning}-04`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };
      }

      case ErrorType.SetJsonWebTokenExpiryInfoMiddleware: {
        return {
          code: `${ResponseCodes.warning}-05`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };
      }

      case ErrorType.SetJsonWebTokenMiddleware: {
        return {
          code: `${ResponseCodes.warning}-06`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };
      }

      case ErrorType.LoginSuccessfulMiddleware: {
        return {
          code: `${ResponseCodes.warning}-07`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };
      }

      case ErrorType.SoloStreakExistsMiddleware: {
        return {
          code: `${ResponseCodes.warning}-08`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };
      }

      case ErrorType.RetreiveTimezoneHeaderMiddleware: {
        return {
          code: `${ResponseCodes.warning}-09`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };
      }

      case ErrorType.ValidateTimezoneMiddleware: {
        return {
          code: `${ResponseCodes.warning}-10`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };
      }

      case ErrorType.RetreiveUserMiddleware: {
        return {
          code: `${ResponseCodes.warning}-11`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };
      }

      case ErrorType.SetTaskCompleteTimeMiddleware: {
        return {
          code: `${ResponseCodes.warning}-12`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };
      }

      case ErrorType.SetStreakStartDateMiddleware: {
        return {
          code: `${ResponseCodes.warning}-13`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };
      }

      case ErrorType.HasTaskAlreadyBeenCompletedTodayMiddleware: {
        return {
          code: `${ResponseCodes.warning}-14`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };
      }

      case ErrorType.CreateCompleteTaskDefinitionMiddleware: {
        return {
          code: `${ResponseCodes.warning}-15`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };
      }

      case ErrorType.SaveTaskCompleteMiddleware: {
        return {
          code: `${ResponseCodes.warning}-16`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };
      }

      case ErrorType.StreakMaintainedMiddleware: {
        return {
          code: `${ResponseCodes.warning}-17`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };
      }

      case ErrorType.SendTaskCompleteResponseMiddleware: {
        return {
          code: `${ResponseCodes.warning}-18`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };
      }

      case ErrorType.SetDayTaskWasCompletedMiddleware: {
        return {
          code: `${ResponseCodes.warning}-19`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };
      }

      case ErrorType.InternalServerError:
      default:
        return {
          code: `${ResponseCodes.warning}-01`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };
    }
  }
}
