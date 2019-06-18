import { CustomError } from "./customError";
import { ResponseCodes } from "./Server/responseCodes";
import { errorHandler } from "./errorHandler";

describe("errorHandler", () => {
  test("that errors are returned to the client directly", () => {
    expect.assertions(2);
    const CustomError = {
      httpStatusCode: 400,
      body: {
        code: "400",
        message: "Mock message"
      },
      localisedErrorMessage: "Mock message"
    } as any;
    const request: any = {};
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const response: any = {
      status
    };
    const next = jest.fn();
    errorHandler(CustomError, request, response, next);
    expect(status).toBeCalledWith(CustomError.httpStatusCode);
    expect(send).toBeCalledWith(CustomError);
  });
});
