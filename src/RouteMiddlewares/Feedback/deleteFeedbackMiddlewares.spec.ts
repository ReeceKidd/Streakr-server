import {
  deleteFeedbackMiddlewares,
  feedbackParamsValidationMiddleware,
  deleteFeedbackMiddleware,
  getDeleteFeedbackMiddleware,
  sendFeedbackDeletedResponseMiddleware,
  getSendFeedbackDeletedResponseMiddleware
} from "./deleteFeedbackMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

describe("feedbackParamsValidationMiddleware", () => {
  test("sends feedbackId is not defined error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: {}
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    feedbackParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "feedbackId" fails because ["feedbackId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends feedbackId is not a string error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: { feedbackId: 123 }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    feedbackParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "feedbackId" fails because ["feedbackId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("deleteFeedbackMiddleware", () => {
  test("sets response.locals.deletedFeedback", async () => {
    expect.assertions(3);
    const feedbackId = "abc123";
    const findByIdAndDelete = jest.fn(() => Promise.resolve(true));
    const feedbackModel = {
      findByIdAndDelete
    };
    const request: any = { params: { feedbackId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getDeleteFeedbackMiddleware(feedbackModel as any);

    await middleware(request, response, next);

    expect(findByIdAndDelete).toBeCalledWith(feedbackId);
    expect(response.locals.deletedFeedback).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("throws NoFeedbackToDeleteFound error when no solo streak is found", async () => {
    expect.assertions(1);
    const feedbackId = "abc123";
    const findByIdAndDelete = jest.fn(() => Promise.resolve(false));
    const feedbackModel = {
      findByIdAndDelete
    };
    const request: any = { params: { feedbackId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getDeleteFeedbackMiddleware(feedbackModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.NoFeedbackToDeleteFound)
    );
  });

  test("calls next with DeleteFeedbackMiddleware error on failure", async () => {
    expect.assertions(1);
    const feedbackId = "abc123";
    const error = "error";
    const findByIdAndDelete = jest.fn(() => Promise.reject(error));
    const feedbackModel = {
      findByIdAndDelete
    };
    const request: any = { params: { feedbackId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getDeleteFeedbackMiddleware(feedbackModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.DeleteFeedbackMiddleware, expect.any(Error))
    );
  });
});

describe("sendFeedbackDeletedResponseMiddleware", () => {
  test("responds with successful deletion", () => {
    expect.assertions(2);
    const successfulDeletionResponseCode = 204;
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const response: any = { status };
    const next = jest.fn();
    const middleware = getSendFeedbackDeletedResponseMiddleware(
      successfulDeletionResponseCode
    );

    middleware(request, response, next);

    expect(status).toBeCalledWith(successfulDeletionResponseCode);
    expect(next).not.toBeCalled();
  });

  test("that on error next is called with error", () => {
    expect.assertions(1);
    const successfulDeletionResponseCode = 204;
    const request: any = {};
    const response: any = {};
    const next = jest.fn();
    const middleware = getSendFeedbackDeletedResponseMiddleware(
      successfulDeletionResponseCode
    );

    middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SendFeedbackDeletedResponseMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("deleteFeedbackMiddlewares", () => {
  test("that deleteFeedbackMiddlewares are defined in the correct order", () => {
    expect.assertions(4);

    expect(deleteFeedbackMiddlewares.length).toEqual(3);
    expect(deleteFeedbackMiddlewares[0]).toEqual(
      feedbackParamsValidationMiddleware
    );
    expect(deleteFeedbackMiddlewares[1]).toEqual(deleteFeedbackMiddleware);
    expect(deleteFeedbackMiddlewares[2]).toEqual(
      sendFeedbackDeletedResponseMiddleware
    );
  });
});
