import { Request, Response, NextFunction } from "express";
import { CustomError } from "./customError";
import { ResponseCodes } from "./Server/responseCodes";

export const errorHandler = (
  error: CustomError,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log(error);
  if (error.httpStatusCode) {
    return response.status(error.httpStatusCode).send(error);
  }
  return response.status(ResponseCodes.warning).send(error);
};
