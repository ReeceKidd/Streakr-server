import { CustomError, ErrorType } from "./customError";

describe("customError", () => {
  test(`creates correct error when type is set to InvalidTimeZone`, () => {
    expect.assertions(3);
    const customerError = new CustomError(ErrorType.InvalidTimezone);
    const { code, message, httpStatusCode } = customerError;
    expect(code).toBe(`400-01`);
    expect(message).toBe("Timezone is invalid.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to UserDoesNotExist`, () => {
    expect.assertions(3);
    const customerError = new CustomError(ErrorType.UserDoesNotExist);
    const { code, message, httpStatusCode } = customerError;
    expect(code).toBe(`400-02`);
    expect(message).toBe("User does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to PasswordDoesNotMatchHash`, () => {
    expect.assertions(3);
    const customerError = new CustomError(ErrorType.PasswordDoesNotMatchHash);
    const { code, message, httpStatusCode } = customerError;
    expect(code).toBe(`400-03`);
    expect(message).toBe("Password does not match hash.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to SoloStreakDoesNotExist`, () => {
    expect.assertions(3);
    const customerError = new CustomError(ErrorType.SoloStreakDoesNotExist);
    const { code, message, httpStatusCode } = customerError;
    expect(code).toBe(`400-04`);
    expect(message).toBe("Solo streak does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to RetreiveUserWithEmailMiddlewareError`, () => {
    expect.assertions(3);
    const customerError = new CustomError(
      ErrorType.RetreiveUserWithEmailMiddlewareError
    );
    const { code, message, httpStatusCode } = customerError;
    expect(code).toBe(`500-02`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to CompareRequestPasswordToUserHashedPasswordMiddleware`, () => {
    expect.assertions(3);
    const customerError = new CustomError(
      ErrorType.CompareRequestPasswordToUserHashedPasswordMiddleware
    );
    const { code, message, httpStatusCode } = customerError;
    expect(code).toBe(`500-03`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SetMinimumUserDataMiddleware`, () => {
    expect.assertions(3);
    const customerError = new CustomError(
      ErrorType.SetMinimumUserDataMiddleware
    );
    const { code, message, httpStatusCode } = customerError;
    expect(code).toBe(`500-04`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SetJsonWebTokenExpiryInfoMiddleware`, () => {
    expect.assertions(3);
    const customerError = new CustomError(
      ErrorType.SetJsonWebTokenExpiryInfoMiddleware
    );
    const { code, message, httpStatusCode } = customerError;
    expect(code).toBe(`500-05`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SetJsonWebTokenMiddleware`, () => {
    expect.assertions(3);
    const customerError = new CustomError(ErrorType.SetJsonWebTokenMiddleware);
    const { code, message, httpStatusCode } = customerError;
    expect(code).toBe(`500-06`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to LoginSuccessfulMiddleware`, () => {
    expect.assertions(3);
    const customerError = new CustomError(ErrorType.LoginSuccessfulMiddleware);
    const { code, message, httpStatusCode } = customerError;
    expect(code).toBe(`500-07`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SoloStreakExistsMiddleware`, () => {
    expect.assertions(3);
    const customerError = new CustomError(ErrorType.SoloStreakExistsMiddleware);
    const { code, message, httpStatusCode } = customerError;
    expect(code).toBe(`500-08`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to InternalServerError`, () => {
    expect.assertions(3);
    const customerError = new CustomError(ErrorType.InternalServerError);
    const { code, message, httpStatusCode } = customerError;
    expect(code).toBe(`500-01`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });
});
