import { UserValidationMiddleware } from "../../../src/Middleware/user.validation.middleware";
import { UserDatabaseHelper } from "../../../src/DatabaseHelpers/userDatabaseHelper";
import { ErrorMessageHelper } from "../../../src/Utils/errorMessage.helper";
import { Request, Response, NextFunction } from "express";

const className = "UserMiddleware";
const classMethods = {
  injectDependencies: "injectDependencies",
  doesEmailExist: "doesEmailExist",
  doesUserNameExist: "doesUserNameExist",
  emailExistsValidation: "emailExistsValidation",
  userNameExistsValidation: "userNameExistsValidation"
};

const mockEmail = "mockedemail@gmail.com";
const mockUserName = "mock-username";

describe(`${className} - ${classMethods.injectDependencies}`, () => {
  it("should update response.body to contain the validation functions for dependency injection", async () => {
    const response: any = { locals: {} };
    const middleware = UserValidationMiddleware.injectDependencies;

    middleware(null, response, err => {
      expect.assertions(2);
      expect(response.locals.doesUserEmailExist).toBe(
        UserDatabaseHelper.doesUserEmailExist
      );
      expect(response.locals.doesUserNameExist).toBe(
        UserDatabaseHelper.doesUserNameExist
      );
    });
  });
});

describe(`${className} - ${classMethods.doesEmailExist}`, () => {
  it("should set response.locals.emailExists to true when email exists", async () => {
    const mockedDoesUserEmailExistsDatabaseCall = jest.fn(() =>
      Promise.resolve(true)
    );

    const request: any = { body: { email: mockEmail } };
    const response: any = {
      locals: { doesUserEmailExist: mockedDoesUserEmailExistsDatabaseCall }
    };

    const middleware = await UserValidationMiddleware.doesEmailExist;

    middleware(request, response, err => {
      expect.assertions(2);
      expect(mockedDoesUserEmailExistsDatabaseCall).toBeCalledWith(mockEmail);
      expect(response.locals.emailExists).toBe(true);
    });
  });

  it("should set response.locals.emailExists to false when email does not exist", async () => {
    const mockedDoesEmailExistsDatabaseCall = jest.fn(() =>
      Promise.resolve(false)
    );
    const request: any = { body: { email: mockEmail } };
    const response: any = {
      locals: { doesUserEmailExist: mockedDoesEmailExistsDatabaseCall }
    };

    const middleware = await UserValidationMiddleware.doesEmailExist;

    middleware(request, response, err => {
      expect.assertions(2);
      expect(mockedDoesEmailExistsDatabaseCall).toBeCalledWith(mockEmail);
      expect(response.locals.emailExists).toBe(false);
    });
  });
});

describe(`${className} - ${classMethods.doesUserNameExist}`, () => {
  it("should set response.locals.userNameExists to true when userName exists", async () => {
    const mockedDoesUserNameExistsDatabaseCall = jest.fn(() =>
      Promise.resolve(true)
    );
    const request: any = { body: { userName: mockUserName } };
    const response: any = {
      locals: { doesUserNameExist: mockedDoesUserNameExistsDatabaseCall }
    };

    const middleware = await UserValidationMiddleware.doesUserNameExist;

    middleware(request, response, err => {
      expect.assertions(2);
      expect(mockedDoesUserNameExistsDatabaseCall).toBeCalledWith(mockUserName);
      expect(response.locals.userNameExists).toBe(true);
    });
  });

  it("should set response.locals.userNameExists to false when userName does not exist", async () => {
    const mockedDoesUserNameExistsDatabaseCall = jest.fn(() =>
      Promise.resolve(false)
    );
    const response: any = {
      locals: { doesUserNameExist: mockedDoesUserNameExistsDatabaseCall }
    };
    const request: any = { body: { userName: mockUserName } };

    const middleware = await UserValidationMiddleware.doesUserNameExist;

    middleware(request, response, err => {
      expect.assertions(2);
      expect(mockedDoesUserNameExistsDatabaseCall).toBeCalledWith(mockUserName);
      expect(response.locals.userNameExists).toBe(false);
    });
  });
});

describe(`${className} - ${classMethods.emailExistsValidation}`, () => {
  it("check that response is returned correctly when email already exists", async () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const next = jest.fn();
    const request: any = { body: { userName: mockUserName } };
    const response: any = {
      locals: { email: mockEmail, emailAlreadyExists: true },
      status
    };

    const middleware = UserValidationMiddleware.emailExistsValidation;

    middleware(request, response, next => {
      expect.assertions(3);
      expect(status).toHaveBeenCalledWith(400);
      expect(send).toBeCalledWith({
        message: ErrorMessageHelper.generateAlreadyExistsMessage(
          "email",
          mockEmail
        )
      });
    });
    expect(next).not.toBeCalled()

  });
});

describe(`${className} - ${classMethods.emailExistsValidation}`, () => {
  it("check that next() is called when email doesn't already exist", async () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const next = jest.fn();
    const request: any = { body: { userName: mockUserName } };
    const response: any = {
      locals: { email: mockEmail, emailAlreadyExists: false },
      status
    };

    const middleware = UserValidationMiddleware.emailExistsValidation;

    middleware(request, response,next)
      expect.assertions(1)
    expect(next).toHaveBeenCalled()
});
})
