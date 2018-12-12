import { Request, Response, NextFunction } from "express";
import {
  emailExistsValidation,
  emailKey
} from "../../../../src/Middleware/Validation/emailExistsValidation";

const middlewareName = "emailExistsValidation";

const mockEmail = "test@gmail.com";

describe(`${middlewareName}`, () => {
  it("check that error response is returned correctly when email already exists", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const generateAlreadyExistsMessage = jest.fn();

    const request = {
      body: { email: mockEmail }
    };
    const response: any = {
      locals: { emailExists: true },
      status
    };
    const next = jest.fn();

    const middleware = emailExistsValidation(generateAlreadyExistsMessage);

    middleware(request as Request, response as Response, next as NextFunction);

    expect.assertions(4);
    expect(status).toHaveBeenCalledWith(400);
    expect(send).toBeCalled();
    expect(generateAlreadyExistsMessage).toBeCalledWith(emailKey, mockEmail);
    expect(next).not.toBeCalled();
  });

  it("check that next is called when email doesn't exist", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const generateAlreadyExistsMessage = jest.fn();

    const request = {
      body: { email: mockEmail }
    };
    const response: any = {
      locals: { emailExists: false },
      status
    };
    const next = jest.fn();

    const middleware = emailExistsValidation(generateAlreadyExistsMessage);

    middleware(request as Request, response as Response, next as NextFunction);

    expect.assertions(4);
    expect(status).not.toHaveBeenCalled();
    expect(send).not.toBeCalled();
    expect(generateAlreadyExistsMessage).not.toBeCalled();
    expect(next).toBeCalled();
  });

  it("check that when error is thrown next is called with err", () => {
      const errorMessage = 'error'
    const send = jest.fn(() => {throw new Error(errorMessage)});
    const status = jest.fn(() => ({ send }));
    const generateAlreadyExistsMessage = jest.fn();

    const request = {
      body: { email: mockEmail }
    };
    const response: any = {
      locals: { emailExists: true },
      status
    };
    const next = jest.fn();

    const middleware = emailExistsValidation(generateAlreadyExistsMessage);

    middleware(request as Request, response as Response, next as NextFunction);

    expect.assertions(1);
    expect(next).toBeCalledWith(new Error(errorMessage));
  });
});
