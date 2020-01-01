/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getOneNoteMiddlewares,
    retreiveNoteMiddleware,
    getRetreiveNoteMiddleware,
    sendNoteMiddleware,
    getNoteParamsValidationMiddleware,
    getSendNoteMiddleware,
} from './getOneNoteMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { ErrorType, CustomError } from '../../customError';

describe(`getNoteParamsValidationMiddleware`, () => {
    const noteId = '12345678';

    test('calls next() when correct params are supplied', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { noteId },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getNoteParamsValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends error response when noteId is missing', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: {},
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getNoteParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "noteId" fails because ["noteId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends error response when noteId is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { noteId: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getNoteParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "noteId" fails because ["noteId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('retreiveNoteMiddleware', () => {
    test('sets response.locals.note', async () => {
        expect.assertions(3);
        const lean = jest.fn(() => Promise.resolve(true));
        const findOne = jest.fn(() => ({ lean }));
        const noteModel = {
            findOne,
        };
        const noteId = 'abcd';
        const request: any = { params: { noteId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveNoteMiddleware(noteModel as any);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ _id: noteId });
        expect(response.locals.note).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws GetNoNoteFound when note is not found', async () => {
        expect.assertions(1);
        const lean = jest.fn(() => Promise.resolve(false));
        const findOne = jest.fn(() => ({ lean }));
        const noteModel = {
            findOne,
        };
        const noteId = 'abcd';
        const request: any = { params: { noteId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveNoteMiddleware(noteModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.GetNoNoteFound));
    });

    test('calls next with RetreiveNoteMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const errorMessage = 'error';
        const lean = jest.fn(() => Promise.reject(errorMessage));
        const findOne = jest.fn(() => ({ lean }));
        const noteModel = {
            findOne,
        };
        const noteId = 'abcd';
        const request: any = { params: { noteId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveNoteMiddleware(noteModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.RetreiveNoteMiddleware, expect.any(Error)));
    });
});

describe('sendNoteMiddleware', () => {
    test('sends note', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const note = { _id: 'abc' };
        const request: any = {};
        const response: any = { locals: { note }, status };
        const next = jest.fn();
        const resourceCreatedCode = 401;
        const middleware = getSendNoteMiddleware(resourceCreatedCode);

        middleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(resourceCreatedCode);
        expect(send).toBeCalledWith(note);
    });

    test('calls next with SendNoteMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const error = 'error';
        const send = jest.fn(() => Promise.reject(error));
        const status = jest.fn(() => ({ send }));
        const response: any = { status };
        const next = jest.fn();
        const resourceCreatedResponseCode = 401;
        const middleware = getSendNoteMiddleware(resourceCreatedResponseCode);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendNoteMiddleware, expect.any(Error)));
    });
});

describe('getOneNoteMiddlewares', () => {
    test('that getNoteMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(getOneNoteMiddlewares.length).toEqual(3);
        expect(getOneNoteMiddlewares[0]).toEqual(getNoteParamsValidationMiddleware);
        expect(getOneNoteMiddlewares[1]).toEqual(retreiveNoteMiddleware);
        expect(getOneNoteMiddlewares[2]).toEqual(sendNoteMiddleware);
    });
});
