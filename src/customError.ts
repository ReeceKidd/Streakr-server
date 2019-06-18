import { ResponseCodes } from "./Server/responseCodes";

export enum ErrorType {
  InternalServerError,
  InvalidTimezone
}

interface ErrorBody {
  code: string;
  message: string;
}

export class CustomError extends Error {
  public body: ErrorBody;
  public httpStatusCode: ResponseCodes;
  public localisedErrorMessage: string;

  constructor(
    type: ErrorType,
    httpStatusCode: ResponseCodes,
    localisedErrorMessage: string,
    ...params: any[]
  ) {
    super(...params);
    const { body } = this.createCustomErrorData(type, httpStatusCode);
    if (!localisedErrorMessage) {
      localisedErrorMessage = body.message;
    }
    this.httpStatusCode = httpStatusCode;
    this.body = body;
    this.localisedErrorMessage = localisedErrorMessage;
  }

  private createCustomErrorData(type: ErrorType, httpStatusCode: Number) {
    switch (type) {
      case ErrorType.InvalidTimezone:
        return {
          body: {
            code: `${httpStatusCode}-02`,
            message: "Timezone is invalid"
          }
        };

      case ErrorType.InternalServerError:
      default:
        return {
          body: {
            code: `${httpStatusCode}-01`,
            message: "Internal Server Error"
          },
          httpStatusCode
        };
    }
  }
}
