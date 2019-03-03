import { getDoesUserEmailExistMiddleware } from "./doesUserEmailExistMiddleware";

const mockEmail = "test@gmail.com";
const ERROR_MESSAGE = "error";

describe(`doesUserEmailExistMiddleware`, () => {

  test("should set emailExists to true when user is found", async () => {
    const findOne = jest.fn(() => Promise.resolve(true));
    const UserModel = {
      findOne
    }
    const request: any = { body: { email: mockEmail } };
    const response: any = { locals: {} };
    const next = jest.fn();

    const middleware = getDoesUserEmailExistMiddleware(UserModel);

    await middleware(request, response, next);

    expect.assertions(3);
    expect(findOne).toBeCalledWith({ email: mockEmail });
    expect(response.locals.emailExists).toBe(true);
    expect(next).toBeCalledWith();
  });

  test("should set emailExists to false when user doesn't exist", async () => {
    const findOne = jest.fn(() => Promise.resolve(false));
    const UserModel = {
      findOne
    }
    const request: any = { body: { email: mockEmail } };
    const response: any = { locals: {} };
    const next = jest.fn();

    const middleware = getDoesUserEmailExistMiddleware(UserModel);

    await middleware(request, response, next);

    expect.assertions(3);
    expect(findOne).toBeCalledWith({ email: mockEmail });
    expect(response.locals.emailExistsw).toBe(undefined);
    expect(next).toBeCalledWith();
  });

  test("should call next() with err paramater if database call fails", async () => {
    const findOne = jest.fn(() => Promise.reject(ERROR_MESSAGE));
    const UserModel = {
      findOne
    }
    const request: any = { body: { email: mockEmail } };
    const response: any = { locals: {} };
    const next = jest.fn();

    const middleware = getDoesUserEmailExistMiddleware(UserModel);

    await middleware(request, response, next);

    expect.assertions(3);
    expect(findOne).toBeCalledWith({ email: mockEmail });
    expect(response.locals.emailExists).toBe(undefined);
    expect(next).toBeCalledWith(ERROR_MESSAGE);
  });
});
