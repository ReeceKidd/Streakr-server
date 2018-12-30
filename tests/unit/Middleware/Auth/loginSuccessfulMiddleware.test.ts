import { getLoginSuccessfulMiddleware } from "../../../../src/Middleware/Auth/loginSuccessfulMiddleware";

const middlewareName = "getLoginSuccessfulMiddleware";

const ERROR_MESSAGE = "error";

const loginSuccessMessage = 'success'

describe(`${middlewareName}`, () => {
  it("should should send login success message", () => {
      
    const send = jest.fn()
    const response: any = { send };

    const request: any = { }
    const next = jest.fn();

    
    const middleware = getLoginSuccessfulMiddleware(loginSuccessMessage);
    middleware(request, response, next)

    expect.assertions(2);
    expect(next).not.toBeCalled()
    expect(send).toBeCalledWith({message: loginSuccessMessage})
  });

  it("should call next with an error on failure", () => {

    const send = jest.fn(() => {
        throw new Error(ERROR_MESSAGE)
    })
    const response: any = { send };

    const request: any = { }
    const next = jest.fn();

    const middleware = getLoginSuccessfulMiddleware(loginSuccessMessage);
    middleware(request, response, next)

    expect.assertions(1);
    expect(next).toBeCalledWith(new Error(ERROR_MESSAGE))
  })


});