import { saveUserToDatabase } from "../../../../src/Middleware/Database/saveUserToDatabase";

const middlewareName = "saveUserToDatabase";

const ERROR_MESSAGE = "error";

describe(`${middlewareName}`, () => {

  it("should send response with saved user", async () => {
      const mockUser = {
          userName: 'User',
          email: 'user@gmail.com',
          password: 'password'
      }
    const save = jest.fn(() => {
        return Promise.resolve(mockUser)
    });
    const send = jest.fn()
   

    const response: any = { locals: { newUser: { save}}, send};
    const request: any = {}
    const next = jest.fn();

    await saveUserToDatabase(request, response, next);

    expect.assertions(3);
    expect(save).toBeCalled();
    expect(send).toBeCalledWith(mockUser);
    expect(next).not.toBeCalled();
  });

  it("should call next() with err paramater if save call fails", async () => {
    const save = jest.fn(() => {
        return Promise.reject(ERROR_MESSAGE)
    });
    const send = jest.fn()

    const request: any = { };
    const response: any = { locals: { newUser: { save}}, send};
    const next = jest.fn();

    await saveUserToDatabase(request, response, next);

    expect.assertions(2);
    expect(next).toBeCalledWith(ERROR_MESSAGE);
    expect(send).not.toBeCalled()

  });

});
