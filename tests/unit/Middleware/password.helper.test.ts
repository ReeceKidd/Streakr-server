import  {PasswordHelper,
  SALT_ROUNDS
} from "../../../src/Middleware/passsord.helper";
import * as brcypt from "bcryptjs";

const className = "PasswordHelper";
const classMethods = {
  injectDependencies: "injectDependencies",
  setHashedPassword: "setHashedPassword",
  comparePasswordToHashedPassword: "comparePasswordToHashedPassword"
};

const mockPassword = "password";

describe(`${className}`, () => {

  describe(`${classMethods.injectDependencies}`, () => {
    it("should  inject necessary dependencies for passwords", () => {
      const response: any = { locals: {} };
      const request: any = {};
      const next = jest.fn();

      const middleware = PasswordHelper.injectDependencies;

      middleware(request, response, next);
      expect.assertions(3);
      expect(response.locals.hash).toBe(brcypt.hash);
      expect(response.locals.SALT).toBe(SALT_ROUNDS)
      expect(next).toBeCalled();
    });
  });

  describe(`${classMethods.setHashedPassword}`, () => {
    it("should set response.locals.hashedPassword to a hashed version of the password", async () => {
  
        const hash = jest.fn()
        const SALT = SALT_ROUNDS
        const response: any = {locals: { hash, SALT}}
        const request: any = {body: {password: mockPassword}}
        const next = jest.fn()
        const middleware = PasswordHelper.setHashedPassword;
  
        await middleware(request, response, next)
           expect.assertions(2)
           expect(response.locals.hash).toBeCalledWith(mockPassword, SALT)
          expect(next).toBeCalled();
    });
  
  });
});


