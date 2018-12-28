import { getCompareHashedRequestPasswordToUserPasswordMiddleware } from "../../../../src/Middleware/Password/getCompareHashedRequestPasswordToUserPasswordMiddleware";


const middlewareName = "getCompareHashedRequestPasswordToUserPasswordMiddleware";

const ERROR_MESSAGE = "error";

describe(`${middlewareName}`, () => {
  it("should set response.locals.passwordMatch to true", async () => {
    const mockedPassword = "password";
    const mockedHashedPassword = "12$4354";
    const compare = jest.fn(() => {
      return Promise.resolve(true);
    });

    const middleware = getCompareHashedRequestPasswordToUserPasswordMiddleware(compare);
    const response: any = { locals: { hashedPassword: mockedHashedPassword, user: { password: mockedPassword}} };
    const request: any = { body: { password: mockedPassword } };
    const next = jest.fn();

    await middleware(request, response, next);

    expect.assertions(3);
    expect(compare).toBeCalledWith(mockedHashedPassword, mockedPassword,);
    expect(response.locals.passwordMatch).toBe(true);
    expect(next).toBeCalled();
  });

  it("should call next() with err paramater if compare fails", async () => {
    const mockedPassword = "password";
    const mockedHashedPassword = "12$4354";
    const compare = jest.fn(() => {
      return Promise.reject(ERROR_MESSAGE);
    });
    

    const middleware = getCompareHashedRequestPasswordToUserPasswordMiddleware(compare);
    const response: any = { locals: { hashedPassword: mockedHashedPassword, user: { password: mockedPassword}} };
    const request: any = { body: { password: mockedPassword } };
    const next = jest.fn();

    await middleware(request, response, next);

    expect.assertions(3);
    expect(compare).toBeCalledWith(mockedHashedPassword, mockedPassword);
    expect(response.locals.passwordMatch).not.toBeDefined();
    expect(next).toBeCalledWith(ERROR_MESSAGE);
  });
});
