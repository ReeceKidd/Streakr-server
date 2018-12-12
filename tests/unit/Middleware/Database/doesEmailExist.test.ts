import { Request, Response, NextFunction } from "express";
import { doesUserEmailExist } from "../../../../src/Middleware/Database/doesEmailExist";

const middlewareName = "doesUserEmailExist";

const mockEmail = "test@gmail.com";

const ERROR_MESSAGE = "error";

describe(`${middlewareName}`, () => {
//   it.only("should default findUser when method isn't passed", async () => {
   
//     const findOne = jest.fn(() => Promise.resolve(true))
   
//     jest.mock("../../../../src/Models/User", () => ({User: {findOne}}))

//     const request: any = { body: { email: mockEmail } };
//     const response: any = { locals: {} };
//     const next = jest.fn();

//     const middleware = doesUserEmailExist();

//     await middleware(request as Request, response as Response, next as NextFunction);

//     console.log(response.locals)

//     expect.assertions(1);

//    expect(findOne).toBeCalled()
//   });

  it("should call findUser with correct email parameter", async () => {
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
