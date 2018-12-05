import PasswordHelper, {
  SALT_ROUNDS
} from "../../../src/Middleware/passsord.helper";
import * as brcypt from "bcrypt";

const className = "PasswordHelper";
const classMethods = {
  injectDependencies: "injectDependencies",
  setHashedPassword: "setHashedPassword",
  comparePasswordToHashedPassword: "comparePasswordToHashedPassword"
};

const mockPassword = "password";

describe(`${className}`, () => {
  
  describe(`${classMethods.injectDependencies}`, () => {
    it("should update response.body to contain the validation functions for dependency injection", async () => {
      const response: any = { locals: {} };
      const request: any = {};
      const next = jest.fn();

      const middleware = PasswordHelper.injectDependencies;

      middleware(request, response, next);
      expect.assertions(3);
      expect(response.locals.hashPassword).toBe(brcypt.hash);
      expect(response.locals.comparePassword).toBe(brcypt.compare);
      expect(next).toBeCalled();
    });
  });

  describe(`${classMethods.setHashedPassword}`, () => {
    // it("should set response.locals.hashedPassword to a hashed version of the password", async () => {
  
    //     const hashPasswordMock = jest.fn()
    //     const response: any = {locals: { hashPassword: hashPasswordMock}}
    //     const request: any = {body: {password: mockPassword}}
    //     const next = jest.fn()
    //     const middleware = PasswordHelper.setHashedPassword;
  
    //     middleware(request, response, next)
    //       // expect.assertions(2)
    //       // expect(response.locals.hashPassword).toBeCalledWith(mockPassword, SALT_ROUNDS, expect.any(Function))
  
    //       // expect(next).toBeCalled();
    //       expect(true).toBe(true)
    // });
  
    it("should return an err when promise rejects", async () => {
      const hashPasswordMock = jest.fn(() => new Error("Password err"));
      const response: any = { locals: { hashPassword: hashPasswordMock } };
      const request: any = { body: { password: mockPassword } };
      const middleware = PasswordHelper.setHashedPassword;
  
      middleware(request, response, next => {
        expect.assertions(3);
        expect(response.locals.hashPassword).toBeCalledWith(
          mockPassword,
          SALT_ROUNDS,
          expect.any(Function)
        );
        expect(response.locals.hashedPassword).toThrowError();
        expect(next).toBeCalled();
      });
    });
  });
});


