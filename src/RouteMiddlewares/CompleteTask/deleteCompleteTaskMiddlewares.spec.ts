import {
  deleteCompleteTaskMiddlewares,
  completeTaskParamsValidationMiddleware,
  deleteCompleteTaskMiddleware,
  getDeleteCompleteTaskMiddleware,
  sendCompleteTaskDeletedResponseMiddleware,
  getSendCompleteTaskDeletedResponseMiddleware
} from "./deleteCompleteTaskMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

describe("completeTaskParamsValidationMiddleware", () => {
  test("sends completeTaskId is not defined error", () => {
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

    completeTaskParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "completeTaskId" fails because ["completeTaskId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends completeTaskId is not a string error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: { completeTaskId: 123 }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    completeTaskParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "completeTaskId" fails because ["completeTaskId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("deleteCompleteTaskMiddleware", () => {
  test("sets response.locals.deletedCompleteTask", async () => {
    expect.assertions(3);
    const completeTaskId = "abc123";
    const findByIdAndDelete = jest.fn(() => Promise.resolve(true));
    const completeTaskModel = {
      findByIdAndDelete
    };
    const request: any = { params: { completeTaskId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getDeleteCompleteTaskMiddleware(
      completeTaskModel as any
    );

    await middleware(request, response, next);

    expect(findByIdAndDelete).toBeCalledWith(completeTaskId);
    expect(response.locals.deletedCompleteTask).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("throws NoCompleteTaskToDeleteFound error when no solo streak is found", async () => {
    expect.assertions(1);
    const completeTaskId = "abc123";
    const findByIdAndDelete = jest.fn(() => Promise.resolve(false));
    const completeTaskModel = {
      findByIdAndDelete
    };
    const request: any = { params: { completeTaskId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getDeleteCompleteTaskMiddleware(
      completeTaskModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.NoCompleteTaskToDeleteFound)
    );
  });

  test("calls next with DeleteCompleteTaskMiddleware error on failure", async () => {
    expect.assertions(1);
    const completeTaskId = "abc123";
    const error = "error";
    const findByIdAndDelete = jest.fn(() => Promise.reject(error));
    const completeTaskModel = {
      findByIdAndDelete
    };
    const request: any = { params: { completeTaskId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getDeleteCompleteTaskMiddleware(
      completeTaskModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.DeleteCompleteTaskMiddleware, expect.any(Error))
    );
  });
});

describe("sendCompleteTaskDeletedResponseMiddleware", () => {
  test("responds with successful deletion", () => {
    expect.assertions(2);
    const successfulDeletionResponseCode = 204;
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const response: any = { status };
    const next = jest.fn();
    const middleware = getSendCompleteTaskDeletedResponseMiddleware(
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
    const middleware = getSendCompleteTaskDeletedResponseMiddleware(
      successfulDeletionResponseCode
    );

    middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SendCompleteTaskDeletedResponseMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("deleteCompleteTaskMiddlewares", () => {
  test("that deleteCompleteTaskMiddlewares are defined in the correct order", () => {
    expect.assertions(4);

    expect(deleteCompleteTaskMiddlewares.length).toEqual(3);
    expect(deleteCompleteTaskMiddlewares[0]).toEqual(
      completeTaskParamsValidationMiddleware
    );
    expect(deleteCompleteTaskMiddlewares[1]).toEqual(
      deleteCompleteTaskMiddleware
    );
    expect(deleteCompleteTaskMiddlewares[2]).toEqual(
      sendCompleteTaskDeletedResponseMiddleware
    );
  });
});
