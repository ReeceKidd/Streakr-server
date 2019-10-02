import {
  createFeedbackMiddlewares,
  createFeedbackBodyValidationMiddleware,
  createFeedbackFromRequestMiddleware,
  getCreateFeedbackFromRequestMiddleware,
  saveFeedbackToDatabaseMiddleware,
  sendFormattedFeedbackMiddleware
} from "./createFeedbackMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

describe(`createFeedbackBodyValidationMiddleware`, () => {
  const userId = "12345678";
  const pageUrl = "/solo-streaks";
  const username = "username";
  const userEmail = "userEmail";
  const feedbackText = "feedbackText";

  const body = {
    userId,
    pageUrl,
    username,
    userEmail,
    feedbackText
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

    createFeedbackBodyValidationMiddleware(request, response, next);

    expect(next).toBeCalled();
  });

  test("sends userId is missing error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { ...body, userId: undefined }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createFeedbackBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "userId" fails because ["userId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends pageUrl is missing error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { ...body, pageUrl: undefined }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createFeedbackBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "pageUrl" fails because ["pageUrl" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends username is missing error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { ...body, username: undefined }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createFeedbackBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "username" fails because ["username" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends userEmail is missing error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { ...body, userEmail: undefined }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createFeedbackBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "userEmail" fails because ["userEmail" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends feedbackText is missing error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { ...body, feedbackText: undefined }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createFeedbackBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "feedbackText" fails because ["feedbackText" is required]'
    });
    expect(next).not.toBeCalled();
  });
});

describe(`createFeedbackFromRequestMiddleware`, () => {
  test("sets response.locals.newFeedback", async () => {
    expect.assertions(2);

    const userId = "12345678";
    const pageUrl = "/solo-streaks";
    const username = "username";
    const userEmail = "userEmail";
    const feedbackText = "feedbackText";

    class Feedback {
      userId: string;
      pageUrl: string;
      username: string;
      userEmail: string;
      feedbackText: string;

      constructor({ userId, pageUrl, username, userEmail, feedbackText }: any) {
        this.userId = userId;
        this.pageUrl = pageUrl;
        this.username = username;
        this.userEmail = userEmail;
        this.feedbackText = feedbackText;
      }
    }
    const response: any = { locals: {} };
    const request: any = {
      body: { userId, pageUrl, username, userEmail, feedbackText }
    };
    const next = jest.fn();
    const newFeedback = new Feedback({
      userId,
      pageUrl,
      username,
      userEmail,
      feedbackText
    });
    const middleware = getCreateFeedbackFromRequestMiddleware(Feedback as any);

    middleware(request, response, next);

    expect(response.locals.newFeedback).toEqual(newFeedback);
    expect(next).toBeCalledWith();
  });

  test("calls next with CreateFeedbackFromRequestMiddleware error on middleware failure", () => {
    expect.assertions(1);
    const timezone = "Europe/London";
    const userId = "abcdefg";
    const name = "streak name";
    const description = "mock streak description";
    const response: any = { locals: { timezone } };
    const request: any = { body: { userId, name, description } };
    const next = jest.fn();
    const middleware = getCreateFeedbackFromRequestMiddleware({} as any);

    middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.CreateFeedbackFromRequestMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`saveFeedbackToDatabaseMiddleware`, () => {
  const ERROR_MESSAGE = "error";

  test("sets response.locals.savedFeedback", async () => {
    expect.assertions(3);
    const save = jest.fn(() => {
      return Promise.resolve(true);
    });
    const mockFeedback = {
      userId: "abcdefg",
      email: "user@gmail.com",
      password: "password",
      save
    } as any;
    const response: any = { locals: { newFeedback: mockFeedback } };
    const request: any = {};
    const next = jest.fn();

    await saveFeedbackToDatabaseMiddleware(request, response, next);

    expect(save).toBeCalled();
    expect(response.locals.savedFeedback).toBeDefined();
    expect(next).toBeCalled();
  });

  test("calls next with SaveFeedbackToDatabaseMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const save = jest.fn(() => {
      return Promise.reject(ERROR_MESSAGE);
    });
    const request: any = {};
    const response: any = { locals: { newFeedback: { save } } };
    const next = jest.fn();

    await saveFeedbackToDatabaseMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SaveFeedbackToDatabaseMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`sendFormattedFeedbackMiddleware`, () => {
  const ERROR_MESSAGE = "error";
  const savedFeedback = {
    userId: "abc",
    streakName: "Daily Spanish",
    streakDescription: "Practice spanish every day",
    startDate: new Date()
  };

  test("responds with status 201 with feedbackText", () => {
    expect.assertions(4);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const feedbackTextResponseLocals = {
      savedFeedback
    };
    const response: any = { locals: feedbackTextResponseLocals, status };
    const request: any = {};
    const next = jest.fn();

    sendFormattedFeedbackMiddleware(request, response, next);

    expect(response.locals.user).toBeUndefined();
    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(ResponseCodes.created);
    expect(send).toBeCalledWith(savedFeedback);
  });

  test("calls next with SendFormattedFeedbackMiddleware error on middleware failure", () => {
    expect.assertions(1);
    const send = jest.fn(() => {
      throw new Error(ERROR_MESSAGE);
    });
    const status = jest.fn(() => ({ send }));
    const response: any = { locals: { savedFeedback }, status };

    const request: any = {};
    const next = jest.fn();

    sendFormattedFeedbackMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SendFormattedFeedbackMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`createFeedbackMiddlewares`, () => {
  test("are defined in the correct order", async () => {
    expect.assertions(5);

    expect(createFeedbackMiddlewares.length).toEqual(4);
    expect(createFeedbackMiddlewares[0]).toBe(
      createFeedbackBodyValidationMiddleware
    );
    expect(createFeedbackMiddlewares[1]).toBe(
      createFeedbackFromRequestMiddleware
    );
    expect(createFeedbackMiddlewares[2]).toBe(saveFeedbackToDatabaseMiddleware);
    expect(createFeedbackMiddlewares[3]).toBe(sendFormattedFeedbackMiddleware);
  });
});
