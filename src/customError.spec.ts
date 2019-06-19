import { CustomError, ErrorType } from "./customError";
import { ResponseCodes } from "./Server/responseCodes";

describe("customError", () => {
  test(`that InvalidTimeZoneError throws what is expected`, () => {
    expect.assertions(3);
    const customerError = new CustomError(ErrorType.InvalidTimezoneError);
    const { body, httpStatusCode } = customerError;
    expect(body.code).toBe(`${ResponseCodes.badRequest}-01`);
    expect(body.message).toBe("Timezone is invalid.");
    expect(httpStatusCode).toBe(ResponseCodes.badRequest);
  });

  test(`that InternalServerError throws what is expected`, () => {
    expect.assertions(3);
    const customerError = new CustomError(ErrorType.InternalServerError);
    const { body, httpStatusCode } = customerError;
    expect(body.code).toBe(`${ResponseCodes.warning}-01`);
    expect(body.message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(ResponseCodes.warning);
  });
});
