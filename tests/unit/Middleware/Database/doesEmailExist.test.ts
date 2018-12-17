import { doesUserEmailExist } from "../../../../src/Middleware/Database/doesEmailExist";

const middlewareName = "doesUserEmailExist";

const mockEmail = "test@gmail.com";

const ERROR_MESSAGE = "error";

describe(`${middlewareName}`, () => {

  it("should set emailExists to true when user is found", async () => {
    const findUser = jest.fn(() => Promise.resolve(true));

    const request: any = { body: { email: mockEmail } };
    const response: any = { locals: {} };
    const next = jest.fn();

    const middleware = doesUserEmailExist(findUser);

    await middleware(request, response, next);

    expect.assertions(3);
    expect(findUser).toBeCalledWith({ email: mockEmail });
    expect(response.locals.emailExists).toBe(true);
    expect(next).toBeCalledWith();
  });

  it("should set emailExists to false when user doesn't exist", async () => {
    const findUser = jest.fn(() => Promise.resolve(false));

    const request: any = { body: { email: mockEmail } };
    const response: any = { locals: {} };
    const next = jest.fn();

    const middleware = doesUserEmailExist(findUser);

    await middleware(request, response, next);

    expect.assertions(3);
    expect(findUser).toBeCalledWith({ email: mockEmail });
    expect(response.locals.emailExistsw).toBe(undefined);
    expect(next).toBeCalledWith();
  });

  it("should call next() with err paramater if database call fails", async () => {
    const findUser = jest.fn(() => Promise.reject(ERROR_MESSAGE));

    const request: any = { body: { email: mockEmail } };
    const response: any = { locals: {} };
    const next = jest.fn();

    const middleware = doesUserEmailExist(findUser);

    await middleware(request, response, next);

    expect.assertions(3);
    expect(findUser).toBeCalledWith({ email: mockEmail });
    expect(response.locals.emailExists).toBe(undefined);
    expect(next).toBeCalledWith(ERROR_MESSAGE);
  });
});
