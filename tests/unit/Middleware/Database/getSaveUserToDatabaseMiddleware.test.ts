import { getSaveUserToDatabaseMiddleware  } from "../../../../src/Middleware/Database/getSaveUserToDatabaseMiddleware";

const middlewareName = "getSaveUserToDatabaseMiddleware ";

const ERROR_MESSAGE = "error";

describe(`${middlewareName}`, () => {

  it("should send response with saved user", async () => {
    const save = jest.fn(() => {
        return Promise.resolve(mockUser)
    }); 
    const mockUser = {
          userName: 'User',
          email: 'user@gmail.com',
          password: 'password',
          save
      }
   
    const response: any = { locals: { newUser: mockUser}};
    const request: any = {}
    const next = jest.fn();

    await getSaveUserToDatabaseMiddleware (request, response, next);

    expect.assertions(3);
    expect(save).toBeCalled();
    expect(response.locals.savedUser).toBeDefined()
    expect(next).toBeCalled();
  });

  it("should call next() with err paramater if save call fails", async () => {
    const save = jest.fn(() => {
        return Promise.reject(ERROR_MESSAGE)
    });

    const request: any = { };
    const response: any = { locals: { newUser: { save}}};
    const next = jest.fn();

    await getSaveUserToDatabaseMiddleware(request, response, next);

    expect.assertions(1);
    expect(next).toBeCalledWith(ERROR_MESSAGE);

  });

});
