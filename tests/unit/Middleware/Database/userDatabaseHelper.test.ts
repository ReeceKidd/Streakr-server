import { Request, Response, NextFunction } from "express";
import { UserDatabaseHelper } from "../../../../src/Middleware/Database/userDatabaseHelper";

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
      expect.assertions(1);
      expect(response.locals.userModel).toBeDefined();
    });
  });
});
