import {
  deleteAgendaJobMiddlewares,
  agendaJobParamsValidationMiddleware,
  deleteAgendaJobMiddleware,
  getDeleteAgendaJobMiddleware,
  sendAgendaJobDeletedResponseMiddleware,
  getSendAgendaJobDeletedResponseMiddleware
} from "./deleteAgendaJobMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

describe("agendaJobParamsValidationMiddleware", () => {
  test("sends agendaJobId is not defined error", () => {
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

    agendaJobParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "agendaJobId" fails because ["agendaJobId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends agendaJobId is not a string error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: { agendaJobId: 123 }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    agendaJobParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "agendaJobId" fails because ["agendaJobId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("deleteAgendaJobMiddleware", () => {
  test("sets response.locals.deletedAgendaJob", async () => {
    expect.assertions(3);
    const agendaJobId = "abc123";
    const findByIdAndDelete = jest.fn(() => Promise.resolve(true));
    const agendaJobModel = {
      findByIdAndDelete
    };
    const request: any = { params: { agendaJobId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getDeleteAgendaJobMiddleware(agendaJobModel as any);

    await middleware(request, response, next);

    expect(findByIdAndDelete).toBeCalledWith(agendaJobId);
    expect(response.locals.deletedAgendaJob).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("throws NoAgendaJobToDeleteFound error when no solo streak is found", async () => {
    expect.assertions(1);
    const agendaJobId = "abc123";
    const findByIdAndDelete = jest.fn(() => Promise.resolve(false));
    const agendaJobModel = {
      findByIdAndDelete
    };
    const request: any = { params: { agendaJobId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getDeleteAgendaJobMiddleware(agendaJobModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.NoAgendaJobToDeleteFound)
    );
  });

  test("calls next with DeleteAgendaJobMiddleware error on failure", async () => {
    expect.assertions(1);
    const agendaJobId = "abc123";
    const error = "error";
    const findByIdAndDelete = jest.fn(() => Promise.reject(error));
    const agendaJobModel = {
      findByIdAndDelete
    };
    const request: any = { params: { agendaJobId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getDeleteAgendaJobMiddleware(agendaJobModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.DeleteAgendaJobMiddleware, expect.any(Error))
    );
  });
});

describe("sendAgendaJobDeletedResponseMiddleware", () => {
  test("responds with successful deletion", () => {
    expect.assertions(2);
    const successfulDeletionResponseCode = 204;
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const response: any = { status };
    const next = jest.fn();
    const middleware = getSendAgendaJobDeletedResponseMiddleware(
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
    const middleware = getSendAgendaJobDeletedResponseMiddleware(
      successfulDeletionResponseCode
    );

    middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SendAgendaJobDeletedResponseMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("deleteAgendaJobMiddlewares", () => {
  test("that deleteAgendaJobMiddlewares are defined in the correct order", () => {
    expect.assertions(4);

    expect(deleteAgendaJobMiddlewares.length).toEqual(3);
    expect(deleteAgendaJobMiddlewares[0]).toEqual(
      agendaJobParamsValidationMiddleware
    );
    expect(deleteAgendaJobMiddlewares[1]).toEqual(deleteAgendaJobMiddleware);
    expect(deleteAgendaJobMiddlewares[2]).toEqual(
      sendAgendaJobDeletedResponseMiddleware
    );
  });
});
