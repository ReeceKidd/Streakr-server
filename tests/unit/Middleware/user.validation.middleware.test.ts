import { UserValidationMiddleware } from "../../../src/Middleware/user.validation.middleware";
import { UserDatabaseHelper } from "../../../src/Middleware/Database/userDatabaseHelper";
import { ErrorMessageHelper } from "../../../src/Utils/errorMessage.helper";
import { Request, Response, NextFunction } from "express";

const className = "UserValidationMiddleware";
const classMethods = {
  injectDependencies: "injectDependencies",
  emailExistsValidation: "emailExistsValidation",
  userNameExistsValidation: "userNameExistsValidation"
};

const mockEmail = "mockedemail@gmail.com";
const mockUserName = "mock-username";

describe(`${className}`, () => {
  describe(`${classMethods.injectDependencies}`, () => {
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

  describe(`${classMethods.emailExistsValidation}`, () => {
    it("check that error response is returned correctly when email already exists", async () => {
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const next = jest.fn();
      const request = {
        body: { email: mockEmail, userName: mockUserName }
      };
      const response: any = {
        locals: { emailExists: true },
        status
      };

      const middleware = UserValidationMiddleware.emailExistsValidation;

      middleware(request as Request, response as Response, next => {
        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(400);
        expect(send).toBeCalledWith({
          message: ErrorMessageHelper.generateAlreadyExistsMessage(
            "email",
            mockEmail
          )
        });
      });
      expect(next).not.toBeCalled();
    });
  });

  describe(`${classMethods.emailExistsValidation}`, () => {
    it("check that next() is called when email doesn't already exist", async () => {
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const next = jest.fn();
      const request: any = {
        body: { userName: mockUserName, email: mockEmail }
      };
      const response: any = {
        locals: { emailExists: false },
        status
      };

      const middleware = UserValidationMiddleware.emailExistsValidation;

      middleware(request, response, next);
      expect.assertions(1);
      expect(next).toHaveBeenCalled();
    });
  });

  describe(`${classMethods.userNameExistsValidation}`, () => {
    it("check that error response is returned correctly when userName already exists", async () => {
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const next = jest.fn();
      const request: any = {
        body: { userName: mockUserName, email: mockEmail }
      };
      const response: any = {
        locals: { userNameExists: true },
        status
      };

      const middleware = UserValidationMiddleware.userNameExistsValidation;

      middleware(request, response, next => {
        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(400);
        expect(send).toBeCalledWith({
          message: ErrorMessageHelper.generateAlreadyExistsMessage(
            "userName",
            mockUserName
          )
        });
      });
      expect(next).not.toBeCalled();
    });
  });

  describe(`${classMethods.userNameExistsValidation}`, () => {
    it("check that next() is called when userName doesn't already exist", async () => {
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const next = jest.fn();
      const request: any = {
        body: { userName: mockUserName, email: mockEmail }
      };
      const response: any = {
        locals: { userNameAlreadyExists: false },
        status
      };

      const middleware = UserValidationMiddleware.userNameExistsValidation;

      middleware(request, response, next);
      expect.assertions(1);
      expect(next).toHaveBeenCalled();
    });
  });
});
