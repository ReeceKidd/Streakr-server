import { Request, Response, NextFunction } from "express";
import {
  getUserNameExistsValidationMiddleware
} from "../../../Middleware/Validation/User/userNameExistsValidationMiddleware";

const mockUserName = "testName";

const userNameKey = 'userName'
const subject = 'subject'

describe(`userNameExistsValidationMiddleware`, () => {
  test("check that error response is returned correctly when userName already exists", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const generateAlreadyExistsMessage = jest.fn();

    const request = {
      body: { userName: mockUserName }
    };
    const response: any = {
      locals: { userNameExists: true },
      status
    };
    const next = jest.fn();

    const middleware = getUserNameExistsValidationMiddleware(generateAlreadyExistsMessage, subject, userNameKey);

    middleware(request as Request, response as Response, next as NextFunction);

    expect.assertions(4);
    expect(status).toHaveBeenCalledWith(400);
    expect(send).toBeCalled();
    expect(generateAlreadyExistsMessage).toBeCalledWith(subject, userNameKey, mockUserName);
    expect(next).not.toBeCalled();
  });

  test("check that next is called when userName doesn't exist", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const generateAlreadyExistsMessage = jest.fn();

    const request = {
      body: { userName: mockUserName }
    };
    const response: any = {
      locals: { userNameExists: false },
      status
    };
    const next = jest.fn();

    const middleware = getUserNameExistsValidationMiddleware(generateAlreadyExistsMessage, subject, userNameKey);

    middleware(request as Request, response as Response, next as NextFunction);

    expect.assertions(4);
    expect(status).not.toHaveBeenCalled();
    expect(send).not.toBeCalled();
    expect(generateAlreadyExistsMessage).not.toBeCalled();
    expect(next).toBeCalled();
  });

  test("check that when error is thrown next is called with err", () => {
    const errorMessage = 'error'
    const send = jest.fn(() => { throw new Error(errorMessage) });
    const status = jest.fn(() => ({ send }));
    const generateAlreadyExistsMessage = jest.fn();

    const request = {
      body: { userName: mockUserName }
    };
    const response: any = {
      locals: { userNameExists: true },
      status
    };
    const next = jest.fn();

    const middleware = getUserNameExistsValidationMiddleware(generateAlreadyExistsMessage, subject, userNameKey);

    middleware(request as Request, response as Response, next as NextFunction);

    expect.assertions(1);
    expect(next).toBeCalledWith(new Error(errorMessage));
  });
});
