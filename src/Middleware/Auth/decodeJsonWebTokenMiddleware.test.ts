import { getDecodeJsonWebTokenMiddleware } from '../../../../src/Middleware/Auth/decodeJsonWebTokenMiddleware';

const ERROR_MESSAGE = 'error';

describe('decodeJsonWebTokenMiddleware', () => {
  test('that response.locals.token is set', async () => {
    const tokenMock = '1234';
    const verifyMock = jest.fn(() => true);
    const jwtSecretMock = '1234';
    const response: any = { locals: { jsonWebToken: tokenMock } };
    const request: any = {};
    const next = jest.fn();

    const middleware = getDecodeJsonWebTokenMiddleware(verifyMock, jwtSecretMock);
    await middleware(request, response, next);

    expect.assertions(3);
    expect(verifyMock).toBeCalledWith(tokenMock, jwtSecretMock);
    expect(response.locals.decodedToken).toBeDefined();
    expect(next).toBeCalled();
  });

  test('that response.locals.jsonWebTokenError is defined', async () => {
    expect.assertions(2);
    const verifyMock = jest.fn(() => {

      throw new Error(ERROR_MESSAGE);
    });
    const tokenMock = '1234';
    const jwtSecretMock = '1234';

    const response: any = { locals: { jsonWebToken: tokenMock } };
    const request: any = {};
    const next = jest.fn();

    const middleware = getDecodeJsonWebTokenMiddleware(verifyMock, jwtSecretMock);
    await middleware(request, response, next);

    expect(next).toBeCalled();
    expect(response.locals.jsonWebTokenError).toEqual(new Error(ERROR_MESSAGE))
  });


  test("next should be called on failure", () => {

    const verifyMock = jest.fn(() => {
      throw new Error(ERROR_MESSAGE)
    })
    const jwtSecretMock = '1234'
    const response: any = {}
    const request: any = {}
    const next = jest.fn();

    const middleware = getDecodeJsonWebTokenMiddleware(verifyMock, jwtSecretMock);
    middleware(request, response, next)

    expect.assertions(1);
    expect(next).toBeCalledWith(new TypeError("Cannot destructure property `jsonWebToken` of 'undefined' or 'null'."))
  })



});
