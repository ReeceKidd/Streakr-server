import { ResponseCodes } from "./Server/responseCodes";

export enum ErrorType {
  InternalServerError,
  InvalidTimezoneError,
  UserDoesNotExistError,
  PasswordDoesNotMatchHash
}

interface ErrorBody {
  code: string;
  message: string;
}

export class CustomError extends Error {
  public body: ErrorBody;
  public httpStatusCode: ResponseCodes;

  constructor(type: ErrorType, ...params: any[]) {
    super(...params);
    const { body, httpStatusCode } = this.createCustomErrorData(type);
    this.httpStatusCode = httpStatusCode;
    this.body = body;
  }

  private createCustomErrorData(type: ErrorType) {
    switch (type) {
      case ErrorType.InvalidTimezoneError:
        return {
          body: {
            code: `${ResponseCodes.badRequest}-01`,
            message: "Timezone is invalid."
          },
          httpStatusCode: ResponseCodes.badRequest
        };

      case ErrorType.UserDoesNotExistError:
        return {
          body: {
            code: `${ResponseCodes.badRequest}-02`,
            message: "User does not exist."
          },
          httpStatusCode: ResponseCodes.badRequest
        };

      case ErrorType.PasswordDoesNotMatchHash: {
        return {
          body: {
            code: `${ResponseCodes.badRequest}-03`,
            message: "Password does not match hash"
          },
          httpStatusCode: ResponseCodes.badRequest
        };
      }

      case ErrorType.InternalServerError:
      default:
        return {
          body: {
            code: `${ResponseCodes.warning}-01`,
            message: "Internal Server Error."
          },
          httpStatusCode: ResponseCodes.warning
        };
    }
  }
}
