import { getRetreiveJsonWebTokenMiddleware, } from './retreiveJsonWebTokenMiddleware';
import { SupportedHeaders } from '../../Server/headers';

describe('retreiveJsonWebTokenMiddleware', () => {
  test('should set response.locals.jsonWebToken', () => {

    const jsonWebTokenHeaderNameMock = 123;

    const response: any = { locals: {} };
    const request: any = { headers: { [SupportedHeaders.xAccessToken]: jsonWebTokenHeaderNameMock } };
    const next = jest.fn();

    const middleware = getRetreiveJsonWebTokenMiddleware(SupportedHeaders.xAccessToken);
    middleware(request, response, next);

    expect.assertions(2);
    expect(response.locals.jsonWebToken).toBeDefined();
    expect(next).toBeCalled();
  });

  test('should call next with an error on failure', () => {

    const response: any = { locals: {} };
    const request: any = {};
    const next = jest.fn();

    const middleware = getRetreiveJsonWebTokenMiddleware(SupportedHeaders.xAccessToken);
    middleware(request, response, next);

    expect.assertions(1);
    expect(next).toBeCalledWith(new TypeError("Cannot read property 'x-access-token' of undefined"));
  });

});
