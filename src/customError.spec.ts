import { CustomError, ErrorType } from "./customError";

describe("customError", () => {
  test(`creates correct error when type is set to InvalidTimeZone`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.InvalidTimezone);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-01`);
    expect(message).toBe("Timezone is invalid.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to UserDoesNotExist`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.UserDoesNotExist);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-02`);
    expect(message).toBe("User does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to PasswordDoesNotMatchHash`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.PasswordDoesNotMatchHash);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-03`);
    expect(message).toBe("Password does not match hash.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to SoloStreakDoesNotExist`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SoloStreakDoesNotExist);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-04`);
    expect(message).toBe("Solo streak does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to NoSoloStreakToDeleteFound`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.NoSoloStreakToDeleteFound);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-06`);
    expect(message).toBe("No solo streak found.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to GetSoloStreakNoSoloStreakFound`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.GetSoloStreakNoSoloStreakFound
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-07`);
    expect(message).toBe("No solo streak found.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to UpdatedSoloStreakNotFound`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.UpdatedSoloStreakNotFound);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-08`);
    expect(message).toBe("No solo streak found.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to UserEmailAlreadyExists`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.UserEmailAlreadyExists);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-09`);
    expect(message).toBe("User email already exists.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to UsernameAlreadyExists`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.UsernameAlreadyExists);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-10`);
    expect(message).toBe("Username already exists.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to StripeSubscriptionUserDoesNotExist`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.StripeSubscriptionUserDoesNotExist
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-11`);
    expect(message).toBe("User does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to CustomerIsAlreadySubscribed`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.CustomerIsAlreadySubscribed);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-12`);
    expect(message).toBe("User is already subscribed.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to TaskAlreadyCompletedToday`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.TaskAlreadyCompletedToday);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`422-01`);
    expect(message).toBe("Task already completed today.");
    expect(httpStatusCode).toBe(422);
  });

  test(`creates correct error when type is not defined`, () => {
    expect.assertions(3);

    const customError = new CustomError("Unknown" as any);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-01`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to InternalServerError`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.InternalServerError);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-01`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to RetreiveUserWithEmailMiddlewareError`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.RetreiveUserWithEmailMiddlewareError
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-02`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to CompareRequestPasswordToUserHashedPasswordMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CompareRequestPasswordToUserHashedPasswordMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-03`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SetMinimumUserDataMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SetMinimumUserDataMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-04`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SetJsonWebTokenExpiryInfoMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SetJsonWebTokenExpiryInfoMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-05`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SetJsonWebTokenMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SetJsonWebTokenMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-06`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to LoginSuccessfulMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.LoginSuccessfulMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-07`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SoloStreakExistsMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SoloStreakExistsMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-08`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to RetreiveTimezoneHeaderMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.RetreiveTimezoneHeaderMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-09`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to ValidateTimezoneMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.ValidateTimezoneMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-10`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to RetreiveUserMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.RetreiveUserMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-11`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SetTaskCompleteTimeMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SetTaskCompleteTimeMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-12`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SetStreakStartDateMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SetStreakStartDateMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-13`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to HasTaskAlreadyBeenCompletedTodayMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.HasTaskAlreadyBeenCompletedTodayMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-14`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to CreateCompleteTaskDefinitionMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CreateCompleteTaskDefinitionMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-15`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SaveTaskCompleteMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SaveTaskCompleteMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-16`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to StreakMaintainedMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.StreakMaintainedMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-17`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendTaskCompleteResponseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendTaskCompleteResponseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-18`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SetDayTaskWasCompletedMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SetDayTaskWasCompletedMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-19`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DefineCurrentTimeMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.DefineCurrentTimeMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-20`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DefineStartDayMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.DefineStartDayMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-21`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DefineEndDayMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.DefineEndOfDayMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-22`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to CreateSoloStreakFromRequestMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CreateSoloStreakFromRequestMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-23`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SaveSoloStreakToDatabase`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SaveSoloStreakToDatabaseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-24`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendFormattedSoloStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendFormattedSoloStreakMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-25`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DeleteSoloStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.DeleteSoloStreakMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-26`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendSoloStreakDeletedResponseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendSoloStreakDeletedResponseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-27`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to RetreiveSoloStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.RetreiveSoloStreakMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-28`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendSoloStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SendSoloStreakMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-29`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to FindSoloStreaksMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.FindSoloStreaksMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-30`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendSoloStreaksMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SendSoloStreaksMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-31`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to PatchSoloStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.PatchSoloStreakMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-32`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendUpdatedSoloStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendUpdatedSoloStreakMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-33`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SetSearchQueryToLowercaseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SetSearchQueryToLowercaseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-34`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to RetreiveUsersByUsernameRegexSearchMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.RetreiveUsersByLowercaseUsernameRegexSearchMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-35`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to FormatUsersMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.FormatUsersMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-36`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendUsersMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SendUsersMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-37`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DoesUserEmailExistMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.DoesUserEmailExistMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-38`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SetUsernmaeToLowercaseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SetUsernameToLowercaseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-39`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DoesUsernameAlreadyExistMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.DoesUsernameAlreadyExistMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-40`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to HashPasswordMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.HashPasswordMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-41`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SaveUserToDatabaseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SaveUserToDatabaseMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-42`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendFormattedUserMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SendFormattedUserMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-43`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to IsUserAnExistingStripeCustomerMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.IsUserAnExistingStripeCustomerMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-44`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to CreateStripeCustomerMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CreateStripeCustomerMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-45`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to CreateStripeSubscriptionMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CreateStripeSubscriptionMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-46`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to HandleInitialPaymentOutcomeMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.HandleInitialPaymentOutcomeMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-47`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendSuccessfulSubscriptionMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendSuccessfulSubscriptionMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-48`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to IncompletePayment`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.IncompletePayment);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-49`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to UnknownPaymentStatus`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.UnknownPaymentStatus);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-50`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to AddStripeSubscriptionToUserMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.AddStripeSubscriptionToUserMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-51`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });
});
