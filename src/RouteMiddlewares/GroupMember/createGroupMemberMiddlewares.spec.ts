import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import {
  createGroupMemberMiddlewares,
  groupStreakExistsMiddleware,
  createGroupMemberBodyValidationMiddleware,
  friendExistsMiddleware,
  getAddFriendToGroupStreakMiddleware,
  sendCreateGroupMemberResponseMiddleware,
  getFriendExistsMiddleware,
  getGroupStreakExistsMiddleware,
  getCreateGroupMemberStreakMiddleware,
  createGroupMemberStreakMiddleware,
  addFriendToGroupStreakMiddleware,
  createGroupMemberParamsValidationMiddleware
} from "./createGroupMemberMiddlewares";

describe(`createGroupMemberParamsValidationMiddleware`, () => {
  const groupStreakId = "abcdefg";

  const params = {
    groupStreakId
  };

  test("valid request passes validation", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createGroupMemberParamsValidationMiddleware(request, response, next);

    expect(next).toBeCalled();
  });

  test("sends groupStreakId is missing error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: { ...params, groupStreakId: undefined }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createGroupMemberParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "groupStreakId" fails because ["groupStreakId" is required]'
    });
    expect(next).not.toBeCalled();
  });
});

describe(`createGroupMemberBodyValidationMiddleware`, () => {
  const friendId = "12345678";

  const body = {
    friendId
  };

  test("valid request passes validation", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createGroupMemberBodyValidationMiddleware(request, response, next);

    expect(next).toBeCalled();
  });

  test("sends friendId is missing error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { ...body, friendId: undefined }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createGroupMemberBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "friendId" fails because ["friendId" is required]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("friendExistsMiddleware", () => {
  test("sets response.locals.friend and calls next()", async () => {
    expect.assertions(4);
    const lean = jest.fn(() => true);
    const findOne = jest.fn(() => ({ lean }));
    const userModel = { findOne };
    const friendId = "abcdefg";
    const request: any = { body: { friendId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getFriendExistsMiddleware(userModel as any);

    await middleware(request, response, next);

    expect(response.locals.friend).toBeDefined();
    expect(findOne).toBeCalledWith({ _id: friendId });
    expect(lean).toBeCalledWith();
    expect(next).toBeCalledWith();
  });

  test("throws CreateGroupMemberFriendDoesNotExist when friend does not exist", async () => {
    expect.assertions(1);
    const friendId = "abcd";
    const lean = jest.fn(() => false);
    const findOne = jest.fn(() => ({ lean }));
    const userModel = { findOne };
    const request: any = { body: { friendId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getFriendExistsMiddleware(userModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.CreateGroupMemberFriendDoesNotExist)
    );
  });

  test("throws CreateGroupMemberGroupStreakExistsMiddleware error on middleware failure", async () => {
    expect.assertions(1);

    const request: any = {};
    const response: any = {};
    const next = jest.fn();
    const middleware = getFriendExistsMiddleware({} as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.CreateGroupMemberFriendExistsMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("groupStreakExistsMiddleware", () => {
  test("sets response.locals.groupStreak and calls next()", async () => {
    expect.assertions(3);
    const groupStreakId = "abc";
    const request: any = {
      params: { groupStreakId }
    };
    const response: any = { locals: {} };
    const next = jest.fn();
    const lean = jest.fn().mockResolvedValue(true);
    const findOne = jest.fn(() => ({ lean }));
    const groupStreakModel = { findOne };
    const middleware = getGroupStreakExistsMiddleware(groupStreakModel as any);

    await middleware(request, response, next);

    expect(findOne).toBeCalledWith({ _id: groupStreakId });
    expect(response.locals.groupStreak).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("throws CreateGroupMemberGroupStreakDoesNotExist error when group streak does not exist", async () => {
    expect.assertions(1);
    const groupStreakId = "abc";
    const request: any = {
      params: { groupStreakId }
    };
    const response: any = { locals: {} };
    const next = jest.fn();
    const lean = jest.fn().mockResolvedValue(false);
    const findOne = jest.fn(() => ({ lean }));
    const groupStreakModel = { findOne };
    const middleware = getGroupStreakExistsMiddleware(groupStreakModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.CreateGroupMemberGroupStreakDoesNotExist)
    );
  });

  test("throws CreateGroupMemberGroupStreakExistsMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const request: any = {};
    const response: any = {};
    const next = jest.fn();
    const middleware = getGroupStreakExistsMiddleware({} as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.CreateGroupMemberGroupStreakExistsMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`createGroupMemberStreakMiddleware`, () => {
  test("sets response.locals.groupMemberStreak", async () => {
    expect.assertions(2);

    const friendId = "abcdefg";
    const groupStreakId = "1a2b3c";
    const timezone = "Europe/London";
    const save = jest.fn().mockResolvedValue(true);
    class GroupMember {
      userId: string;
      groupStreakId: string;
      timezone: string;

      constructor({ friendId, groupStreakId, timezone }: any) {
        this.userId = friendId;
        this.groupStreakId = groupStreakId;
        this.timezone = timezone;
      }

      save = save;
    }
    const response: any = { locals: { timezone } };
    const request: any = { body: { friendId }, params: { groupStreakId } };
    const next = jest.fn();
    const middleware = getCreateGroupMemberStreakMiddleware(GroupMember as any);

    await middleware(request, response, next);

    expect(save).toBeCalled();
    expect(next).toBeCalledWith();
  });

  test("calls next with CreateGroupMemberCreateGroupMemberStreakMiddleware error on middleware failure", () => {
    expect.assertions(1);
    const response: any = {};
    const request: any = {};
    const next = jest.fn();
    const middleware = getCreateGroupMemberStreakMiddleware({} as any);

    middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.CreateGroupMemberCreateGroupMemberStreakMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`addFriendToGroupStreakMiddleware`, () => {
  test("sets response.locals.groupStreak to the updatedGroupStreak", async () => {
    expect.assertions(3);
    const lean = jest.fn().mockResolvedValue(true);
    const findByIdAndUpdate = jest.fn(() => ({ lean }));
    const groupStreakModel: any = {
      findByIdAndUpdate
    };
    const groupMemberStreakId = 2;
    const groupMemberStreak = {
      _id: groupMemberStreakId
    };
    const members: any[] = [];
    const groupStreakId = 1;
    const groupStreak = {
      _id: groupStreakId,
      members
    };
    const friendId = "abc";
    const request: any = { body: { friendId }, params: { groupStreakId } };
    const response: any = { locals: { groupStreak, groupMemberStreak } };
    const next: any = jest.fn();
    const middleware = await getAddFriendToGroupStreakMiddleware(
      groupStreakModel
    );

    await middleware(request, response, next);

    expect(findByIdAndUpdate).toBeCalledWith(
      groupStreakId,
      {
        members: [{ memberId: friendId, groupMemberStreakId }]
      },
      { new: true }
    );
    expect(lean).toBeCalled();
    expect(next).toBeCalledWith();
  });

  test("calls next with AddFriendToGroupStreakMiddleware error on middleware failure", () => {
    expect.assertions(1);

    const request: any = {};
    const response: any = {};
    const next = jest.fn();
    const middleware = getAddFriendToGroupStreakMiddleware({} as any);

    middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.AddFriendToGroupStreakMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`sendCreateGroupMemberResponseMiddleware`, () => {
  test("responds with status 201 with groupMember", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const memberId = "memberId";
    const groupStreakId = "groupStreakId";
    const members = [{ memberId, groupStreakId }];
    const groupStreak = {
      members
    };
    const response: any = { locals: { groupStreak }, status };
    const request: any = {};
    const next = jest.fn();

    sendCreateGroupMemberResponseMiddleware(request, response, next);

    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(ResponseCodes.created);
    expect(send).toBeCalledWith(groupStreak.members);
  });

  test("calls next with SendFormattedGroupMemberMiddleware error on middleware failure", () => {
    expect.assertions(1);

    const request: any = {};
    const response: any = {};
    const next = jest.fn();

    sendCreateGroupMemberResponseMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SendCreateGroupMemberResponseMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`createGroupMemberMiddlewares`, () => {
  test("are defined in the correct order", async () => {
    expect.assertions(8);

    expect(createGroupMemberMiddlewares.length).toEqual(7);
    expect(createGroupMemberMiddlewares[0]).toBe(
      createGroupMemberParamsValidationMiddleware
    );
    expect(createGroupMemberMiddlewares[1]).toBe(
      createGroupMemberBodyValidationMiddleware
    );
    expect(createGroupMemberMiddlewares[2]).toBe(friendExistsMiddleware);
    expect(createGroupMemberMiddlewares[3]).toBe(groupStreakExistsMiddleware);
    expect(createGroupMemberMiddlewares[4]).toBe(
      createGroupMemberStreakMiddleware
    );
    expect(createGroupMemberMiddlewares[5]).toBe(
      addFriendToGroupStreakMiddleware
    );
    expect(createGroupMemberMiddlewares[6]).toBe(
      sendCreateGroupMemberResponseMiddleware
    );
  });
});
