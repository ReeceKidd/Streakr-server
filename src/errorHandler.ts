import { Request, Response, NextFunction } from "express";
import { CustomError } from "./customError";

export const errorHandler = (
  error: CustomError,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response.status(error.httpStatusCode).send(error);
};
