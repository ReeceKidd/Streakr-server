import { celebrate } from "celebrate";
import { UserValidation } from "../../../src/Validation/user.validation";

const validUserName = "Tester";
const validEmail = "tester@gmail.com";
const validPassword = "password";

const POST = "POST";

describe("User Routes Validation (Registration) Test", () => {
  it("checks that valid register request passes", () => {
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

  
  it("checks that request fails because email is undefined", () => {
    const req: any = {
      body: {
        userName:validUserName,
        email: undefined,
        password: validPassword
      },
      method: POST
    };
    const middleware = celebrate(UserValidation.register);

    middleware(req, null, err => {
      expect.assertions(1);
      expect(err.message).toBe(
        'child "email" fails because ["email" is required]'
      );
    });
  });

  it("checks that request fails because email is not valid", () => {
    const req: any = {
      body: {
        userName:validUserName,
        email: 'notanemail',
        password: validPassword
      },
      method: POST
    };
    const middleware = celebrate(UserValidation.register);

    middleware(req, null, err => {
      expect.assertions(1);
      expect(err.message).toBe(
        'child "email" fails because ["email" must be a valid email]'
      );
    });
  });

  it("checks that request fails because password is undefined", () => {
    const req: any = {
      body: {
        userName:validUserName,
        email: validEmail,
        password: undefined
      },
      method: POST
    };
    const middleware = celebrate(UserValidation.register);

    middleware(req, null, err => {
      expect.assertions(1);
      expect(err.message).toBe(
        'child "password" fails because ["password" is required]'
      );
    });
  });

  it("checks that request fails because password is too short", () => {
    const req: any = {
      body: {
        userName:validUserName,
        email: validEmail,
        password: '1234'
      },
      method: POST
    };
    const middleware = celebrate(UserValidation.register);

    middleware(req, null, err => {
      expect.assertions(1);
      expect(err.message).toBe(
        'child "password" fails because ["password" length must be at least 6 characters long]'
      );
    });
  });
});

describe("User Routes Validation (Login) Test", () => {
  it("checks that valid login request passes", () => {
    const req: any = {
      body: {
        email: validEmail,
        password: validPassword
      },
      method: POST
    };
    const middleware = celebrate(UserValidation.login);

    middleware(req, null, err => {
      expect.assertions(2);
      expect(req.body).toEqual({
        email: validEmail,
        password: validPassword
      });
      expect(err).toBeNull();
    });
  });
 
  it("checks that request fails because email is undefined", () => {
    const req: any = {
      body: {
        email: undefined,
        password: validPassword
      },
      method: POST
    };
    const middleware = celebrate(UserValidation.login);

    middleware(req, null, err => {
      expect.assertions(1);
      expect(err.message).toBe(
        'child "email" fails because ["email" is required]'
      );
    });
  });

  it("checks that request fails because email is number", () => {
    const req: any = {
      body: {
        email: 1234,
        password: validPassword
      },
      method: POST
    };
    const middleware = celebrate(UserValidation.login);

    middleware(req, null, err => {
      expect.assertions(1);
      expect(err.message).toBe(
        'child "email" fails because ["email" must be a string]'
      );
    });
  });

  it("checks that request fails because email is not valid", () => {
    const req: any = {
      body: {
        email: 'notanemail',
        password: validPassword
      },
      method: POST
    };
    const middleware = celebrate(UserValidation.login);

    middleware(req, null, err => {
      expect.assertions(1);
      expect(err.message).toBe(
        'child "email" fails because ["email" must be a valid email]'
      );
    });
  });

  it("checks that request fails because password is undefined", () => {
    const req: any = {
      body: {
        email: validEmail,
        password: undefined
      },
      method: POST
    };
    const middleware = celebrate(UserValidation.login);

    middleware(req, null, err => {
      expect.assertions(1);
      expect(err.message).toBe(
        'child "password" fails because ["password" is required]'
      );
    });
  });

  it("checks that request fails because password is a number", () => {
    const req: any = {
      body: {
        email: validEmail,
        password: 1234
      },
      method: POST
    };
    const middleware = celebrate(UserValidation.login);

    middleware(req, null, err => {
      expect.assertions(1);
      expect(err.message).toBe(
        'child "password" fails because ["password" must be a string]'
      );
    });
  });

  it("checks that request fails because password is too short", () => {
    const req: any = {
      body: {
        email: validEmail,
        password: '1234'
      },
      method: POST
    };
    const middleware = celebrate(UserValidation.login);

    middleware(req, null, err => {
      expect.assertions(1);
      expect(err.message).toBe(
        'child "password" fails because ["password" length must be at least 6 characters long]'
      );
    });
  });
});
