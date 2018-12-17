import { doesUserNameExist } from "../../../../src/Middleware/Database/doesUserNameExist";

const middlewareName = "doesUserNameExist";

const mockUserName = "testname";

const ERROR_MESSAGE = "error";

describe(`${middlewareName}`, () => {

  it("should set userNameExists to true when userExists", async () => {
    const findUser = jest.fn(() => Promise.resolve(true));

    const request: any = { body: { userName: mockUserName } };
    const response: any = { locals: {} };
    const next = jest.fn();

    const middleware = doesUserNameExist(findUser);

    await middleware(request, response, next);

    expect.assertions(3);
    expect(findUser).toBeCalledWith({ userName: mockUserName });
    expect(response.locals.userNameExists).toBe(true);
    expect(next).toBeCalledWith();
  });

  it("should set userNameExists to false when user doesn't exist", async () => {
    const findUser = jest.fn(() => Promise.resolve(false));

    const request: any = { body: { userName: mockUserName } };
    const response: any = { locals: {} };
    const next = jest.fn();

    const middleware = doesUserNameExist(findUser);

    await middleware(request, response, next);

    expect.assertions(3);
    expect(findUser).toBeCalledWith({ userName: mockUserName });
    expect(response.locals.userNameExists).toBe(undefined);
    expect(next).toBeCalledWith();
  });

  it("should call next() with err paramater if database call fails", async () => {
    const findUser = jest.fn(() => Promise.reject(ERROR_MESSAGE));

    const request: any = { body: { userName: mockUserName} };
    const response: any = { locals: {} };
    const next = jest.fn();

    const middleware = doesUserNameExist(findUser);

    await middleware(request, response, next);

    expect.assertions(3);
    expect(findUser).toBeCalledWith({ userName: mockUserName });
    expect(response.locals.userNameExists).toBe(undefined);
    expect(next).toBeCalledWith(ERROR_MESSAGE);
  });
});
