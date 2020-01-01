/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    deleteNoteMiddlewares,
    noteParamsValidationMiddleware,
    deleteNoteMiddleware,
    getDeleteNoteMiddleware,
    sendNoteDeletedResponseMiddleware,
    getSendNoteDeletedResponseMiddleware,
} from './deleteNoteMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe('noteParamsValidationMiddleware', () => {
    test('sends noteId is not defined error', () => {
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

        noteParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "noteId" fails because ["noteId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends noteId is not a string error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { noteId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        noteParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "noteId" fails because ["noteId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('deleteNoteMiddleware', () => {
    test('sets response.locals.deletedNote', async () => {
        expect.assertions(3);
        const noteId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(true));
        const noteModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { noteId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteNoteMiddleware(noteModel as any);

        await middleware(request, response, next);

        expect(findByIdAndDelete).toBeCalledWith(noteId);
        expect(response.locals.deletedNote).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws NoNoteToDeleteFound error when no solo streak is found', async () => {
        expect.assertions(1);
        const noteId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(false));
        const noteModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { noteId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteNoteMiddleware(noteModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.NoNoteToDeleteFound));
    });

    test('calls next with DeleteNoteMiddleware error on failure', async () => {
        expect.assertions(1);
        const noteId = 'abc123';
        const error = 'error';
        const findByIdAndDelete = jest.fn(() => Promise.reject(error));
        const noteModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { noteId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteNoteMiddleware(noteModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.DeleteNoteMiddleware, expect.any(Error)));
    });
});

describe('sendNoteDeletedResponseMiddleware', () => {
    test('responds with successful deletion', () => {
        expect.assertions(2);
        const successfulDeletionResponseCode = 204;
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const response: any = { status };
        const next = jest.fn();
        const middleware = getSendNoteDeletedResponseMiddleware(successfulDeletionResponseCode);

        middleware(request, response, next);

        expect(status).toBeCalledWith(successfulDeletionResponseCode);
        expect(next).not.toBeCalled();
    });

    test('that on error next is called with error', () => {
        expect.assertions(1);
        const successfulDeletionResponseCode = 204;
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getSendNoteDeletedResponseMiddleware(successfulDeletionResponseCode);

        middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendNoteDeletedResponseMiddleware, expect.any(Error)));
    });
});

describe('deleteNoteMiddlewares', () => {
    test('that deleteNoteMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(deleteNoteMiddlewares.length).toEqual(3);
        expect(deleteNoteMiddlewares[0]).toEqual(noteParamsValidationMiddleware);
        expect(deleteNoteMiddlewares[1]).toEqual(deleteNoteMiddleware);
        expect(deleteNoteMiddlewares[2]).toEqual(sendNoteDeletedResponseMiddleware);
    });
});
