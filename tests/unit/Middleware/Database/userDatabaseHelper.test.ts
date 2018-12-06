import { Request, Response, NextFunction } from "express";
import { UserDatabaseHelper } from "../../../../src/Middleware/Database/userDatabaseHelper";
import { not } from "joi";

const className = "UserDatabaseHelper";
const classMethods = {
  injectDependencies: "injectDependencies",
  saveUserToDatabase: "saveUserToDatabse",
  doesUserEmailExist: "doesUserEmailExist",
  doesUserNameExist: "doesUserNameExist",
  deleteUser: "deleteUser",
  updateUser: "updateUser"
};

describe(`${className}`, () => {
  describe(`${classMethods.injectDependencies}`, () => {
    it("should define response.locals.userModel", async () => {
      const response: any = { locals: {} };
      const next = jest.fn();
      const middleware = UserDatabaseHelper.injectDependencies;

      middleware(null as Request, response as Response, next as NextFunction);
      expect.assertions(2);
      expect(response.locals.userModel).toBeDefined();
      expect(next).toBeCalled();
    });
  });

  describe(`${classMethods.saveUserToDatabase}`, () => {
    it("should save new user to database correctly", async () => {
      const save = jest.fn(() => Promise.resolve(true));
      const response: any = { locals: { newUser: { save } } };
      const next = jest.fn();
      const middleware = UserDatabaseHelper.saveUserToDatabase;

      await middleware(null as Request, response as Response, next as NextFunction);
      expect.assertions(3);
      expect(save).toBeCalled()
      expect(response.locals.user).toBeDefined()
      expect(next).toBeCalled()
    });

    it("should send response with error when save call fails", async () => {
        const save = jest.fn(() => Promise.reject());
        const send = jest.fn()
        const response: any = { locals: { newUser: { save } }, send };
        const next = jest.fn();
        const middleware = UserDatabaseHelper.saveUserToDatabase;
  
        await middleware(null as Request, response as Response, next as NextFunction);
        expect.assertions(4);
        expect(save).toBeCalled()
        expect(response.locals.user).not.toBeDefined()
        expect(next).not.toBeCalled()
        expect(send).toBeCalled()
      });
  });
});
