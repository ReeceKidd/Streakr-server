import {
  getGroupStreaksMiddlewares,
  getGroupStreaksQueryValidationMiddleware,
  getFindGroupStreaksMiddleware,
  findGroupStreaksMiddleware,
  sendGroupStreaksMiddleware,
  retreiveGroupStreakMembersInformation,
  getRetreiveGroupStreakMembersInformation
} from "./getGroupStreaksMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

describe("getGroupStreaksValidationMiddleware", () => {
  test("passes valid request", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      query: { memberId: "1234" }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    getGroupStreaksQueryValidationMiddleware(request, response, next);

    expect(next).toBeCalledWith();
  });
});

describe("findGroupStreaksMiddleware", () => {
  test("queries database with just memberId and sets response.locals.groupStreaks", async () => {
    expect.assertions(4);

    const lean = jest.fn().mockResolvedValue(true);
    const find = jest.fn(() => ({ lean }));
    const groupStreakModel = {
      find
    };
    const memberId = "1234";
    const request: any = { query: { memberId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getFindGroupStreaksMiddleware(groupStreakModel as any);

    await middleware(request, response, next);

    expect(find).toBeCalledWith({ members: memberId });
    expect(lean).toBeCalledWith();
    expect(response.locals.groupStreaks).toEqual(true);
    expect(next).toBeCalledWith();
  });

  test("queries database with just timezone and sets response.locals.groupStreaks", async () => {
    expect.assertions(4);

    const lean = jest.fn().mockResolvedValue(true);
    const find = jest.fn(() => ({ lean }));
    const groupStreakModel = {
      find
    };
    const timezone = "Europe/London";
    const request: any = { query: { timezone } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getFindGroupStreaksMiddleware(groupStreakModel as any);

    await middleware(request, response, next);

    expect(find).toBeCalledWith({ timezone });
    expect(lean).toBeCalledWith();
    expect(response.locals.groupStreaks).toEqual(true);
    expect(next).toBeCalledWith();
  });

  test("calls next with FindGroupStreaksMiddleware error on middleware failure", async () => {
    expect.assertions(1);

    const request: any = {};
    const response: any = {};
    const next = jest.fn();
    const middleware = getFindGroupStreaksMiddleware({} as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.FindGroupStreaksMiddleware, expect.any(Error))
    );
  });
});

describe("retreiveGroupStreakMembersInformation", () => {
  test("retreives group streak members information and sets response.locals.groupStreaksWithUsers", async () => {
    expect.assertions(4);

    const user = { _id: "12345678", username: "usernames" };
    const lean = jest.fn().mockResolvedValue(user);
    const findOne = jest.fn(() => ({ lean }));
    const userModel: any = {
      findOne
    };
    const members = ["12345678"];
    const groupStreaks = [{ _id: "abc", members }];
    const request: any = {};
    const response: any = { locals: { groupStreaks } };
    const next = jest.fn();

    const middleware = getRetreiveGroupStreakMembersInformation(userModel);
    await middleware(request, response, next);

    expect(findOne).toHaveBeenCalledTimes(1);
    expect(lean).toHaveBeenCalledTimes(1);
    expect(response.locals.groupStreaksWithUsers).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("calls next with RetreiveGroupStreakMembersInformation on middleware failure", async () => {
    expect.assertions(1);

    const response: any = {};
    const request: any = {};
    const next = jest.fn();

    const middleware = getRetreiveGroupStreakMembersInformation({} as any);
    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.RetreiveGroupStreakMembersInformation,
        expect.any(Error)
      )
    );
  });
});

describe("sendGroupStreaksMiddleware", () => {
  test("sends groupStreaks in response", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const groupStreaksWithUsers = [
      {
        name: "30 minutes reading",
        description: "Read for 30 minutes everyday",
        members: [
          {
            _id: "abcd",
            username: "user"
          }
        ]
      }
    ];
    const response: any = { locals: { groupStreaksWithUsers }, status };
    const next = jest.fn();

    sendGroupStreaksMiddleware(request, response, next);

    expect.assertions(3);
    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(ResponseCodes.success);
    expect(send).toBeCalledWith({ groupStreaks: groupStreaksWithUsers });
  });

  test("calls next with SendGroupStreaksMiddleware on middleware failure", () => {
    expect.assertions(1);
    const ERROR_MESSAGE = "sendGroupStreaks error";
    const send = jest.fn(() => {
      throw new Error(ERROR_MESSAGE);
    });
    const status = jest.fn(() => ({ send }));
    const response: any = { locals: {}, status };
    const request: any = {};
    const next = jest.fn();

    sendGroupStreaksMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.SendGroupStreaksMiddleware, expect.any(Error))
    );
  });
});

describe(`getGroupStreaksMiddlewares`, () => {
  test("that getGroupStreaksMiddlewares are defined in the correct order", async () => {
    expect.assertions(5);

    expect(getGroupStreaksMiddlewares.length).toEqual(4);
    expect(getGroupStreaksMiddlewares[0]).toBe(
      getGroupStreaksQueryValidationMiddleware
    );
    expect(getGroupStreaksMiddlewares[1]).toBe(findGroupStreaksMiddleware);
    expect(getGroupStreaksMiddlewares[2]).toBe(
      retreiveGroupStreakMembersInformation
    );
    expect(getGroupStreaksMiddlewares[3]).toBe(sendGroupStreaksMiddleware);
  });
});
