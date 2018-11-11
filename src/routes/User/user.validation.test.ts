import { celebrate } from "celebrate";
import { UserValidation } from "./user.validation";

const validUserName = "Tester";
const validEmail = "tester@gmail.com";
const validPassword = "password";

const POST = "POST";

describe("User Routes Validation Test", () => {
  it("checks that valid request passes", () => {
    const req: any = {
      body: {
        userName: validUserName,
        email: validEmail,
        password: validPassword
      },
      method: POST
    };
    const middleware = celebrate(UserValidation.register);

    middleware(req, null, err => {
      expect.assertions(2);
      expect(req.body).toEqual({
        userName: validUserName,
        email: validEmail,
        password: validPassword
      });
      expect(err).toBeNull();
    });
  });

  it("checks that request fails because userName is undefined", () => {
    const req: any = {
      body: {
        userName: undefined,
        email: validEmail,
        password: validPassword
      },
      method: POST
    };
    const middleware = celebrate(UserValidation.register);

    middleware(req, null, err => {
      expect.assertions(1);
      expect(err.message).toBe(
        'child "userName" fails because ["userName" is required]'
      );
    });
  });
});
