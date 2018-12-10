import { Request, Response, NextFunction } from "express";
import { UserDatabaseHelper } from "../../../../src/Middleware/Database/userDatabaseHelper";

const className = "UserDatabaseHelper";
const classMethods = {
  injectDependencies: "injectDependencies",
  saveUserToDatabase: "saveUserToDatabse",
  doesUserEmailExist: "doesUserEmailExist",
  doesUserNameExist: "doesUserNameExist"
};

const mockEmail = "test@gmail.com";
const mockUserName = "test"

describe(`${className}`, () => {
  describe(`${classMethods.injectDependencies}`, () => {
    it("should define necessary dependencies", async () => {
      const response: any = { locals: {} };
      const next = jest.fn();
      const middleware = UserDatabaseHelper.injectDependencies;

      middleware(null as Request, response as Response, next as NextFunction);
      expect.assertions(4)
      expect(response.locals.findUser).toBeDefined();
      expect(response.locals.setEmailExists).toBeDefined();
      expect(response.locals.setUserNameExists).toBeDefined();
      expect(next).toBeCalled();
    });
  });

  describe(`${classMethods.doesUserEmailExist}`, () => {
    it("should call findUser with correct parameters", () => {
        
     const setEmailExists = jest.fn()
     const findUser = jest.fn();
     
      const request: any = { body: { email: mockEmail } };
      const response: any = { locals: {findUser, setEmailExists }};
      const next = jest.fn();

      UserDatabaseHelper.doesUserEmailExist(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect.assertions(2);
      expect(findUser).toBeCalledWith(
        { email: mockEmail },
        setEmailExists()
      );
      expect(setEmailExists).toBeCalledWith(response, next)
    });
  });

  describe(`${classMethods.doesUserNameExist}`, () => {
    it("should call findUser with correct parameters", () => {
        
     const setUserNameExists = jest.fn()
     const findUser = jest.fn();
     
      const request: any = { body: { userName: mockUserName } };
      const response: any = { locals: {findUser, setUserNameExists}};
      const next = jest.fn();

      UserDatabaseHelper.doesUserNameExist(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect.assertions(2);
      expect(findUser).toBeCalledWith(
        { userName: mockUserName },
        setUserNameExists()
      );
      expect(setUserNameExists).toBeCalledWith(response, next)
    });
  });

  
});
