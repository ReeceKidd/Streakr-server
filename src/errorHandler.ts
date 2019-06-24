import { Request, Response, NextFunction } from "express";
import { CustomError } from "./customError";
import { ResponseCodes } from "./Server/responseCodes";

export const errorHandler = (
  error: CustomError,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log("MADE IT TO ERROR handler");
  console.log(`httpStatus: ${error.httpStatusCode}`);
  if (error.httpStatusCode) {
    response.status(error.httpStatusCode).send(error);
  } else {
    response.status(ResponseCodes.warning).send(error);
  }
};
