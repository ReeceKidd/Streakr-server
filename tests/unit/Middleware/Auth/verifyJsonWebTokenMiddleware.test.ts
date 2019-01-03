import { getVerifyJsonWebTokenMiddleware } from "../../../../src/Middleware/Auth/verifyJsonWebTokenMiddleware";

const middlewareName = "verifyJsonWebTokenMiddleware";

const ERROR_MESSAGE = "error";

describe(`${middlewareName}`, () => {
  it("should set response.locals.token", () => {
    const tokenMock = '1234'
    const verifyMock = jest.fn(() => true)
    const jwtSecretMock = '1234'
    const response: any = { locals: {token: tokenMock} };
    const request: any = { }
    const next = jest.fn();

    const callback = jest.fn()

    
    const middleware = getVerifyJsonWebTokenMiddleware(verifyMock, jwtSecretMock);
    middleware(request, response, next)

    expect.assertions(3);
    expect(verifyMock).toBeCalledWith(tokenMock, jwtSecretMock, expect.any(Function))
    expect(response.locals.decodedToken).toBeDefined()
    expect(next).toBeCalled()
  });

  it("should call next with an error on failure", () => {
    const verifyMock = jest.fn(() => {
        throw new Error(ERROR_MESSAGE)
    })
    const tokenMock = '1234'
    const jwtSecretMock = '1234'

    const response: any = { locals: {token: tokenMock }};
    const request: any = { }
    const next = jest.fn();

    const middleware = getVerifyJsonWebTokenMiddleware(verifyMock, jwtSecretMock);
    middleware(request, response, next)

    expect.assertions(1);
    expect(next).toBeCalledWith(new Error(ERROR_MESSAGE))
  })


});