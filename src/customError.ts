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
  SetDayTaskWasCompletedMiddleware,
  DefineCurrentTimeMiddleware,
  DefineStartDayMiddleware,
  DefineEndOfDayMiddleware,
  CreateSoloStreakFromRequestMiddleware,
  SaveSoloStreakToDatabaseMiddleware,
  SendFormattedSoloStreakMiddleware,
  NoSoloStreakToDeleteFound,
  DeleteSoloStreakMiddleware,
  SendSoloStreakDeletedResponseMiddleware,
  GetSoloStreakNoSoloStreakFound,
  RetreiveSoloStreakMiddleware,
  SendSoloStreakMiddleware,
  FindSoloStreaksMiddleware,
  SendSoloStreaksMiddleware,
  UpdatedSoloStreakNotFound,
  PatchSoloStreakMiddleware,
  SendUpdatedSoloStreakMiddleware,
  SetSearchQueryToLowercaseMiddleware,
  RetreiveUsersByUsernameRegexSearchMiddleware,
  FormatUsersMiddleware,
  SendFormattedUsersMiddleware,
  UserEmailAlreadyExists,
  DoesUserEmailExistMiddleware,
  SetUsernameToLowercaseMiddleware,
  UsernameAlreadyExists,
  DoesUsernameAlreadyExistMiddleware,
  HashPasswordMiddleware,
  CreateUserFromRequestMiddleware,
  SaveUserToDatabaseMiddleware,
  SendFormattedUserMiddleware,
  RetreiveJsonWebTokenMiddleware,
  MissingAccessTokenHeader,
  VerifyJsonWebTokenError,
  DecodeJsonWebTokenMiddleware,
  SetMinimumUserDataOnResponseLocals
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
      case ErrorType.MissingAccessTokenHeader: {
        return {
          code: `${ResponseCodes.unautohorized}-01`,
          message: "Missing x-access-token header.",
          httpStatusCode: ResponseCodes.unautohorized
        };
      }

      case ErrorType.VerifyJsonWebTokenError: {
        return {
          code: `${ResponseCodes.unautohorized}-02`,
          message: "Verification of JWT failed.",
          httpStatusCode: ResponseCodes.unautohorized
        };
      }

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

      case ErrorType.TaskAlreadyCompletedToday: {
        return {
          code: `${ResponseCodes.badRequest}-05`,
          message: "Task already completed today.",
          httpStatusCode: ResponseCodes.badRequest
        };
      }

      case ErrorType.NoSoloStreakToDeleteFound: {
        return {
          code: `${ResponseCodes.badRequest}-06`,
          message: "No solo streak found.",
          httpStatusCode: ResponseCodes.badRequest
        };
      }

      case ErrorType.GetSoloStreakNoSoloStreakFound: {
        return {
          code: `${ResponseCodes.badRequest}-07`,
          message: "No solo streak found.",
          httpStatusCode: ResponseCodes.badRequest
        };
      }

      case ErrorType.UpdatedSoloStreakNotFound: {
        return {
          code: `${ResponseCodes.badRequest}-08`,
          message: "No solo streak found.",
          httpStatusCode: ResponseCodes.badRequest
        };
      }

      case ErrorType.UserEmailAlreadyExists: {
        return {
          code: `${ResponseCodes.badRequest}-09`,
          message: "User email already exists.",
          httpStatusCode: ResponseCodes.badRequest
        };
      }

      case ErrorType.UsernameAlreadyExists: {
        return {
          code: `${ResponseCodes.badRequest}-10`,
          message: "Username already exists.",
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

      case ErrorType.DefineCurrentTimeMiddleware: {
        return {
          code: `${ResponseCodes.warning}-20`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };
      }

      case ErrorType.DefineStartDayMiddleware:
        return {
          code: `${ResponseCodes.warning}-21`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.DefineEndOfDayMiddleware:
        return {
          code: `${ResponseCodes.warning}-22`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.CreateSoloStreakFromRequestMiddleware:
        return {
          code: `${ResponseCodes.warning}-23`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.SaveSoloStreakToDatabaseMiddleware:
        return {
          code: `${ResponseCodes.warning}-24`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.SendFormattedSoloStreakMiddleware:
        return {
          code: `${ResponseCodes.warning}-25`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.DeleteSoloStreakMiddleware:
        return {
          code: `${ResponseCodes.warning}-26`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.SendSoloStreakDeletedResponseMiddleware:
        return {
          code: `${ResponseCodes.warning}-27`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.RetreiveSoloStreakMiddleware:
        return {
          code: `${ResponseCodes.warning}-28`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.SendSoloStreakMiddleware:
        return {
          code: `${ResponseCodes.warning}-29`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.FindSoloStreaksMiddleware:
        return {
          code: `${ResponseCodes.warning}-30`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.SendSoloStreaksMiddleware:
        return {
          code: `${ResponseCodes.warning}-31`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.PatchSoloStreakMiddleware:
        return {
          code: `${ResponseCodes.warning}-32`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.SendUpdatedSoloStreakMiddleware:
        return {
          code: `${ResponseCodes.warning}-33`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.SetSearchQueryToLowercaseMiddleware:
        return {
          code: `${ResponseCodes.warning}-34`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.RetreiveUsersByUsernameRegexSearchMiddleware:
        return {
          code: `${ResponseCodes.warning}-35`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.FormatUsersMiddleware:
        return {
          code: `${ResponseCodes.warning}-36`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.SendFormattedUsersMiddleware:
        return {
          code: `${ResponseCodes.warning}-37`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.DoesUserEmailExistMiddleware:
        return {
          code: `${ResponseCodes.warning}-38`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.SetUsernameToLowercaseMiddleware:
        return {
          code: `${ResponseCodes.warning}-39`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.DoesUsernameAlreadyExistMiddleware:
        return {
          code: `${ResponseCodes.warning}-40`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.HashPasswordMiddleware:
        return {
          code: `${ResponseCodes.warning}-41`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.CreateUserFromRequestMiddleware:
        return {
          code: `${ResponseCodes.warning}-42`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.SaveUserToDatabaseMiddleware:
        return {
          code: `${ResponseCodes.warning}-43`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.SendFormattedUserMiddleware:
        return {
          code: `${ResponseCodes.warning}-44`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.RetreiveJsonWebTokenMiddleware:
        return {
          code: `${ResponseCodes.warning}-45`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.DecodeJsonWebTokenMiddleware:
        return {
          code: `${ResponseCodes.warning}-46`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

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
