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

  test(`creates correct error when type is set to TaskAlreadyCompletedToday`, () => {
    expect.assertions(3);
    const customError = new CustomError(ErrorType.TaskAlreadyCompletedToday);
    const { code, message, httpStatusCode } = customError;
    expect(code).toBe(`400-05`);
    expect(message).toBe("Task already completed today.");
    expect(httpStatusCode).toBe(400);
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

  test(`creates correct error when type is set to InternalServerError`, () => {
    expect.assertions(3);
    const customError = new CustomError(ErrorType.InternalServerError);
    const { code, message, httpStatusCode } = customError;
    expect(code).toBe(`500-01`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });
});
