import { ResponseCodes } from "./Server/responseCodes";

export enum ErrorType {
  InternalServerError,
  InvalidTimezone,
  AddStripeSubscriptionToUserMiddleware,
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
  RetreiveUsersByLowercaseUsernameRegexSearchMiddleware,
  FormatUsersMiddleware,
  SendUsersMiddleware,
  UserEmailAlreadyExists,
  DoesUserEmailExistMiddleware,
  SetUsernameToLowercaseMiddleware,
  UsernameAlreadyExists,
  DoesUsernameAlreadyExistMiddleware,
  HashPasswordMiddleware,
  SaveUserToDatabaseMiddleware,
  SendFormattedUserMiddleware,
  CreateStripeCustomerMiddleware,
  CreateStripeSubscriptionMiddleware,
  HandleInitialPaymentOutcomeMiddleware,
  SendSuccessfulSubscriptionMiddleware,
  IncompletePayment,
  UnknownPaymentStatus,
  IsUserAnExistingStripeCustomerMiddleware,
  CustomerIsAlreadySubscribed,
  CreateStripeSubscriptionUserDoesNotExist,
  CancelStripeSubscriptionUserDoesNotExist,
  CustomerIsNotSubscribed,
  DoesUserHaveStripeSubscriptionMiddleware,
  CancelStripeSubscriptionMiddleware,
  RemoveSubscriptionFromUserMiddleware,
  SendSuccessfullyRemovedSubscriptionMiddleware,
  SetUserTypeToPremiumMiddleware,
  SetUserTypeToBasicMiddleware,
  NoUserToDeleteFound,
  DeleteUserMiddleware,
  SendUserDeletedResponseMiddleware,
  GetCompleteTasksMiddleware,
  SendCompleteTasksResponseMiddleware,
  NoCompleteTaskToDeleteFound,
  DeleteCompleteTaskMiddleware,
  SendCompleteTaskDeletedResponseMiddleware,
  NoUserFound,
  GetRetreiveUserMiddleware,
  SendRetreiveUserResponseMiddleware
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

      case ErrorType.CreateStripeSubscriptionUserDoesNotExist: {
        return {
          code: `${ResponseCodes.badRequest}-11`,
          message: "User does not exist.",
          httpStatusCode: ResponseCodes.badRequest
        };
      }

      case ErrorType.CustomerIsAlreadySubscribed:
        return {
          code: `${ResponseCodes.badRequest}-12`,
          message: "User is already subscribed.",
          httpStatusCode: ResponseCodes.badRequest
        };

      case ErrorType.CancelStripeSubscriptionUserDoesNotExist: {
        return {
          code: `${ResponseCodes.badRequest}-13`,
          message: "User does not exist.",
          httpStatusCode: ResponseCodes.badRequest
        };
      }

      case ErrorType.CustomerIsNotSubscribed: {
        return {
          code: `${ResponseCodes.badRequest}-14`,
          message: "Customer is not subscribed.",
          httpStatusCode: ResponseCodes.badRequest
        };
      }

      case ErrorType.NoUserToDeleteFound: {
        return {
          code: `${ResponseCodes.badRequest}-15`,
          message: "User does not exist.",
          httpStatusCode: ResponseCodes.badRequest
        };
      }

      case ErrorType.NoCompleteTaskToDeleteFound: {
        return {
          code: `${ResponseCodes.badRequest}-16`,
          message: "Complete task does not exist.",
          httpStatusCode: ResponseCodes.badRequest
        };
      }

      case ErrorType.NoUserFound: {
        return {
          code: `${ResponseCodes.badRequest}-17`,
          message: "User does not exist.",
          httpStatusCode: ResponseCodes.badRequest
        };
      }

      case ErrorType.TaskAlreadyCompletedToday: {
        return {
          code: `${ResponseCodes.unprocessableEntity}-01`,
          message: "Task already completed today.",
          httpStatusCode: ResponseCodes.unprocessableEntity
        };
      }

      case ErrorType.InternalServerError:
        return {
          code: `${ResponseCodes.warning}-01`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

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

      case ErrorType.RetreiveUsersByLowercaseUsernameRegexSearchMiddleware:
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

      case ErrorType.SendUsersMiddleware:
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

      case ErrorType.SaveUserToDatabaseMiddleware:
        return {
          code: `${ResponseCodes.warning}-42`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.SendFormattedUserMiddleware:
        return {
          code: `${ResponseCodes.warning}-43`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.IsUserAnExistingStripeCustomerMiddleware:
        return {
          code: `${ResponseCodes.warning}-44`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.CreateStripeCustomerMiddleware:
        return {
          code: `${ResponseCodes.warning}-45`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.CreateStripeSubscriptionMiddleware:
        return {
          code: `${ResponseCodes.warning}-46`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.HandleInitialPaymentOutcomeMiddleware:
        return {
          code: `${ResponseCodes.warning}-47`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.SendSuccessfulSubscriptionMiddleware:
        return {
          code: `${ResponseCodes.warning}-48`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.IncompletePayment:
        return {
          code: `${ResponseCodes.warning}-49`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.UnknownPaymentStatus:
        return {
          code: `${ResponseCodes.warning}-50`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.AddStripeSubscriptionToUserMiddleware:
        return {
          code: `${ResponseCodes.warning}-51`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.DoesUserHaveStripeSubscriptionMiddleware:
        return {
          code: `${ResponseCodes.warning}-52`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.CancelStripeSubscriptionMiddleware:
        return {
          code: `${ResponseCodes.warning}-53`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.RemoveSubscriptionFromUserMiddleware:
        return {
          code: `${ResponseCodes.warning}-54`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.SendSuccessfullyRemovedSubscriptionMiddleware:
        return {
          code: `${ResponseCodes.warning}-55`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.SetUserTypeToPremiumMiddleware:
        return {
          code: `${ResponseCodes.warning}-56`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.SetUserTypeToBasicMiddleware:
        return {
          code: `${ResponseCodes.warning}-57`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.DeleteUserMiddleware:
        return {
          code: `${ResponseCodes.warning}-58`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.SendUserDeletedResponseMiddleware:
        return {
          code: `${ResponseCodes.warning}-59`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.GetCompleteTasksMiddleware:
        return {
          code: `${ResponseCodes.warning}-60`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.SendCompleteTasksResponseMiddleware:
        return {
          code: `${ResponseCodes.warning}-61`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.DeleteCompleteTaskMiddleware:
        return {
          code: `${ResponseCodes.warning}-62`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.SendCompleteTaskDeletedResponseMiddleware:
        return {
          code: `${ResponseCodes.warning}-63`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.GetRetreiveUserMiddleware:
        return {
          code: `${ResponseCodes.warning}-64`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      case ErrorType.SendRetreiveUserResponseMiddleware:
        return {
          code: `${ResponseCodes.warning}-65`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };

      default:
        return {
          code: `${ResponseCodes.warning}-01`,
          message: internalServerMessage,
          httpStatusCode: ResponseCodes.warning
        };
    }
  }
}
