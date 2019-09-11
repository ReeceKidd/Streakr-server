import {
  createGroupStreakMiddlewares,
  createGroupStreakBodyValidationMiddleware,
  sendGroupStreakMiddleware,
  GroupStreakRegistrationRequestBody,
  createGroupMemberStreaksMiddleware,
  getCreateGroupMemberStreaksMiddleware,
  createGroupStreakMiddleware,
  getCreateGroupStreakMiddleware,
  updateGroupStreakMembersArrayMiddleware,
  getUpdateGroupStreakMembersArray
} from "./createGroupStreakMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

describe(`createGroupStreakBodyValidationMiddleware`, () => {
  const creatorId = "abcdefgh";
  const streakName = "Followed our calorie level";
  const streakDescription = "Stuck to our recommended calorie level";
  const numberOfMinutes = 30;
  const memberId = "memberId";
  const groupMemberStreakId = "groupMemberStreakId";
  const members = [{ memberId, groupMemberStreakId }];

  const body: GroupStreakRegistrationRequestBody = {
    creatorId,
    streakName,
    streakDescription,
    numberOfMinutes,
    members
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

    createGroupStreakBodyValidationMiddleware(request, response, next);

    expect(next).toBeCalled();
  });

  test("sends creatorId is missing error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: {
        ...body,
        creatorId: undefined
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createGroupStreakBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "creatorId" fails because ["creatorId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends streakName is missing error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: {
        ...body,
        streakName: undefined
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createGroupStreakBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "streakName" fails because ["streakName" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends members must be an array error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: {
        ...body,
        members: 123
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createGroupStreakBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "members" fails because ["members" must be an array]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends members must have at least one member error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: {
        ...body,
        members: []
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createGroupStreakBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "members" fails because ["members" must contain at least 1 items]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends members must contain an object with memberId property", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: {
        ...body,
        members: [{ groupMemberStreakId }]
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createGroupStreakBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "members" fails because ["members" at position 0 fails because [child "memberId" fails because ["memberId" is required]]]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends members must contain an object with groupStreakMemberId property", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: {
        ...body,
        members: [{ memberId, groupMemberStreakId: 123 }]
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createGroupStreakBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "members" fails because ["members" at position 0 fails because [child "groupMemberStreakId" fails because ["groupMemberStreakId" must be a string]]]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends numberOfMinutes must be a postive number error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: {
        ...body,
        numberOfMinutes: -1
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createGroupStreakBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "numberOfMinutes" fails because ["numberOfMinutes" must be a positive number]'
    });
    expect(next).not.toBeCalled();
  });
});

describe(`createGroupStreakMiddleware`, () => {
  test("sets response.locals.newGroupStreak and calls next", async () => {
    expect.assertions(3);
    const timezone = "Europe/London";
    const creatorId = "creatorId";
    const streakName = "Daily BJJ";
    const streakDescription = "Everyday I must drill BJJ";
    const numberOfMinutes = 30;

    const save = jest.fn(() => Promise.resolve(true));
    class GroupStreakModel {
      creatorId: string;
      streakName: string;
      streakDescription: string;
      numberOfMinutes: Date;
      timezone: string;

      constructor(
        creatorId: string,
        streakName: string,
        streakDescription: string,
        numberOfMinutes: Date,
        timezone: string
      ) {
        this.creatorId = creatorId;
        this.streakName = streakName;
        this.streakDescription = streakDescription;
        this.numberOfMinutes = numberOfMinutes;
        this.timezone = timezone;
      }

      save = save;
    }
    const request: any = {
      body: { creatorId, streakName, streakDescription, numberOfMinutes }
    };
    const response: any = {
      locals: { timezone }
    };
    const next = jest.fn();
    const middleware = getCreateGroupStreakMiddleware(GroupStreakModel as any);

    await middleware(request, response, next);

    expect(response.locals.newGroupStreak).toBeDefined();
    expect(save).toBeCalledWith();
    expect(next).toBeCalledWith();
  });

  test("throws CreateGroupStreakMiddleware error on Middleware failure", async () => {
    expect.assertions(1);
    const request: any = {};
    const response: any = {
      locals: {}
    };
    const next = jest.fn();
    const middleware = getCreateGroupStreakMiddleware({} as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.CreateGroupStreakMiddleware, expect.any(Error))
    );
  });
});

describe(`createGroupMemberStreaksMiddleware`, () => {
  test("for each member create a new group member streak and return the memberId and the groupMemberStreakId", async () => {
    expect.assertions(3);
    const timezone = "Europe/London";
    const memberId = "memberId";
    const members = [{ memberId }];
    const _id = "_id";
    const newGroupStreak = {
      _id
    };

    const findOne = jest.fn(() => Promise.resolve(true));
    const userModel = { findOne };

    const save = jest.fn(() => Promise.resolve(true));
    class GroupMemberStreakModel {
      userId: string;
      groupStreakId: string;
      timezone: string;

      constructor(userId: string, groupStreakId: string, timezone: string) {
        this.userId = userId;
        this.groupStreakId = groupStreakId;
        this.timezone = timezone;
      }

      save = save;
    }
    const request: any = {
      body: { members }
    };
    const response: any = {
      locals: { timezone, newGroupStreak }
    };
    const next = jest.fn();
    const middleware = getCreateGroupMemberStreaksMiddleware(
      userModel as any,
      GroupMemberStreakModel as any
    );

    await middleware(request, response, next);

    expect(response.locals.newGroupStreak).toBeDefined();
    expect(save).toBeCalledWith();
    expect(next).toBeCalledWith();
  });

  test("throws GroupMemberDoesNotExist error when group member does not exist", async () => {
    expect.assertions(1);
    const timezone = "Europe/London";
    const memberId = "memberId";
    const members = [{ memberId }];
    const _id = "_id";
    const newGroupStreak = {
      _id
    };

    const findOne = jest.fn(() => Promise.resolve(false));
    const userModel = { findOne };

    const save = jest.fn(() => Promise.resolve(true));
    class GroupMemberStreakModel {
      userId: string;
      groupStreakId: string;
      timezone: string;

      constructor(userId: string, groupStreakId: string, timezone: string) {
        this.userId = userId;
        this.groupStreakId = groupStreakId;
        this.timezone = timezone;
      }

      save = save;
    }
    const request: any = {
      body: { members }
    };
    const response: any = {
      locals: { timezone, newGroupStreak }
    };
    const next = jest.fn();
    const middleware = getCreateGroupMemberStreaksMiddleware(
      userModel as any,
      GroupMemberStreakModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.GroupMemberDoesNotExist)
    );
  });

  test("throws CreateGroupStreakCreateMemberStreakMiddleware error on Middleware failure", async () => {
    expect.assertions(1);
    const request: any = {};
    const response: any = {
      locals: {}
    };
    const next = jest.fn();
    const middleware = getCreateGroupMemberStreaksMiddleware(
      {} as any,
      {} as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.CreateGroupStreakCreateMemberStreakMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`createGroupStreakMiddleware`, () => {
  test("sets response.locals.newGroupStreak and calls next", async () => {
    expect.assertions(3);
    const timezone = "Europe/London";
    const creatorId = "creatorId";
    const streakName = "Daily BJJ";
    const streakDescription = "Everyday I must drill BJJ";
    const numberOfMinutes = 30;

    const save = jest.fn(() => Promise.resolve(true));
    class GroupStreakModel {
      creatorId: string;
      streakName: string;
      streakDescription: string;
      numberOfMinutes: Date;
      timezone: string;

      constructor(
        creatorId: string,
        streakName: string,
        streakDescription: string,
        numberOfMinutes: Date,
        timezone: string
      ) {
        this.creatorId = creatorId;
        this.streakName = streakName;
        this.streakDescription = streakDescription;
        this.numberOfMinutes = numberOfMinutes;
        this.timezone = timezone;
      }

      save = save;
    }
    const request: any = {
      body: { creatorId, streakName, streakDescription, numberOfMinutes }
    };
    const response: any = {
      locals: { timezone }
    };
    const next = jest.fn();
    const middleware = getCreateGroupStreakMiddleware(GroupStreakModel as any);

    await middleware(request, response, next);

    expect(response.locals.newGroupStreak).toBeDefined();
    expect(save).toBeCalledWith();
    expect(next).toBeCalledWith();
  });

  test("throws CreateGroupStreakMiddleware error on Middleware failure", async () => {
    expect.assertions(1);
    const request: any = {};
    const response: any = {
      locals: {}
    };
    const next = jest.fn();
    const middleware = getCreateGroupStreakMiddleware({} as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.CreateGroupStreakMiddleware, expect.any(Error))
    );
  });
});

describe(`updateGroupStreakMembersArrayMiddleware`, () => {
  test("updates groupStreak members array", async () => {
    expect.assertions(3);
    const membersWithGroupMemberStreakIds: string[] = [];
    const _id = "_id";
    const newGroupStreak = {
      _id
    };
    const request: any = {};
    const response: any = {
      locals: { membersWithGroupMemberStreakIds, newGroupStreak }
    };
    const next = jest.fn();
    const lean = jest.fn().mockResolvedValue(true);
    const findByIdAndUpdate = jest.fn(() => ({ lean }));
    const groupStreakModel = {
      findByIdAndUpdate
    };
    const middleware = getUpdateGroupStreakMembersArray(
      groupStreakModel as any
    );

    await middleware(request, response, next);

    expect(findByIdAndUpdate).toBeCalledWith(
      _id,
      {
        members: membersWithGroupMemberStreakIds
      },
      { new: true }
    );
    expect(lean).toBeCalledWith();
    expect(next).toBeCalledWith();
  });

  test("throws UpdateGroupStreakMembersArray error on Middleware failure", async () => {
    expect.assertions(1);
    const request: any = {};
    const response: any = {
      locals: {}
    };
    const next = jest.fn();
    const middleware = getUpdateGroupStreakMembersArray({} as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.UpdateGroupStreakMembersArray,
        expect.any(Error)
      )
    );
  });
});

describe(`sendGroupStreakMiddleware`, () => {
  const ERROR_MESSAGE = "error";
  const newGroupStreak = {
    userId: "abc",
    streakName: "Daily Spanish",
    streakDescription: "Practice spanish every day",
    startDate: new Date()
  };

  test("responds with status 201 with groupStreak", () => {
    expect.assertions(4);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const groupStreakResponseLocals = {
      newGroupStreak
    };
    const response: any = { locals: groupStreakResponseLocals, status };
    const request: any = {};
    const next = jest.fn();

    sendGroupStreakMiddleware(request, response, next);

    expect(response.locals.user).toBeUndefined();
    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(ResponseCodes.created);
    expect(send).toBeCalledWith(newGroupStreak);
  });

  test("calls next with SendFormattedGroupStreakMiddleware error on middleware failure", () => {
    expect.assertions(1);
    const send = jest.fn(() => {
      throw new Error(ERROR_MESSAGE);
    });
    const status = jest.fn(() => ({ send }));
    const response: any = { locals: { newGroupStreak }, status };

    const request: any = {};
    const next = jest.fn();

    sendGroupStreakMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SendFormattedGroupStreakMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`createGroupStreakMiddlewares`, () => {
  test("are defined in the correct order", async () => {
    expect.assertions(6);

    expect(createGroupStreakMiddlewares.length).toEqual(5);
    expect(createGroupStreakMiddlewares[0]).toBe(
      createGroupStreakBodyValidationMiddleware
    );
    expect(createGroupStreakMiddlewares[1]).toBe(createGroupStreakMiddleware);
    expect(createGroupStreakMiddlewares[2]).toBe(
      createGroupMemberStreaksMiddleware
    );
    expect(createGroupStreakMiddlewares[3]).toBe(
      updateGroupStreakMembersArrayMiddleware
    );
    expect(createGroupStreakMiddlewares[4]).toBe(sendGroupStreakMiddleware);
  });
});
