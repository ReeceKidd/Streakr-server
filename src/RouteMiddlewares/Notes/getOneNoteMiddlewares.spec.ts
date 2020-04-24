/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getOneNoteMiddlewares,
    retrieveNoteMiddleware,
    getRetrieveNoteMiddleware,
    sendNoteMiddleware,
    getNoteParamsValidationMiddleware,
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

describe('retrieveNoteMiddleware', () => {
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
        const middleware = getRetrieveNoteMiddleware(noteModel as any);

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
        const middleware = getRetrieveNoteMiddleware(noteModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.GetNoNoteFound));
    });

    test('calls next with RetrieveNoteMiddleware error on middleware failure', async () => {
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
        const middleware = getRetrieveNoteMiddleware(noteModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.RetrieveNoteMiddleware, expect.any(Error)));
    });
});

describe('sendNoteMiddleware', () => {
    test('sends note', () => {
        expect.assertions(2);
        const send = jest.fn();
        const note = { _id: 'abc' };
        const request: any = {};
        const response: any = { locals: { note }, send };
        const next = jest.fn();

        sendNoteMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(send).toBeCalledWith(note);
    });

    test('calls next with SendNoteMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        await sendNoteMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendNoteMiddleware, expect.any(Error)));
    });
});

describe('getOneNoteMiddlewares', () => {
    test('that getNoteMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(getOneNoteMiddlewares.length).toEqual(3);
        expect(getOneNoteMiddlewares[0]).toEqual(getNoteParamsValidationMiddleware);
        expect(getOneNoteMiddlewares[1]).toEqual(retrieveNoteMiddleware);
        expect(getOneNoteMiddlewares[2]).toEqual(sendNoteMiddleware);
    });
});
