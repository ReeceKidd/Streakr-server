/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getAllNotesMiddlewares,
    getNotesQueryValidationMiddleware,
    getFindNotesMiddleware,
    findNotesMiddleware,
    sendNotesMiddleware,
} from './getAllNotesMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe('getNotesValidationMiddleware', () => {
    test('passes valid request', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            query: { userId: '1234', streakId: 'abcd' },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getNotesQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalledWith();
    });
});

describe('findNotesMiddleware', () => {
    test('queries database with just userId and sets response.locals.notes', async () => {
        expect.assertions(3);
        const find = jest.fn(() => Promise.resolve(true));
        const noteModel = {
            find,
        };
        const userId = '1234';
        const request: any = { query: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindNotesMiddleware(noteModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ userId });
        expect(response.locals.notes).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database with just streakId and sets response.locals.notes', async () => {
        expect.assertions(3);
        const find = jest.fn(() => Promise.resolve(true));
        const noteModel = {
            find,
        };
        const streakId = 'abcde';
        const request: any = { query: { streakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindNotesMiddleware(noteModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ streakId });
        expect(response.locals.notes).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('calls next with FindNotesMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const ERROR_MESSAGE = 'error';
        const find = jest.fn(() => Promise.reject(ERROR_MESSAGE));
        const noteModel = {
            find,
        };
        const request: any = { query: { userId: '1234' } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindNotesMiddleware(noteModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.FindNotesMiddleware, expect.any(Error)));
    });
});

describe('sendNotesMiddleware', () => {
    test('sends notes in response', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const notes = [
            {
                userId: 'userId',
                streakId: 'streakId',
                note: 'Send note in response',
            },
        ];
        const response: any = { locals: { notes }, status };
        const next = jest.fn();

        sendNotesMiddleware(request, response, next);

        expect.assertions(3);
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.success);
        expect(send).toBeCalledWith(notes);
    });

    test('calls next with SendNotesMiddleware on middleware failure', () => {
        expect.assertions(1);
        const ERROR_MESSAGE = 'sendNotes error';
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: {}, status };
        const request: any = {};
        const next = jest.fn();

        sendNotesMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendNotesMiddleware, expect.any(Error)));
    });
});

describe(`getAllNotesMiddlewares`, () => {
    test('are in the correct order', async () => {
        expect.assertions(4);

        expect(getAllNotesMiddlewares.length).toEqual(3);
        expect(getAllNotesMiddlewares[0]).toBe(getNotesQueryValidationMiddleware);
        expect(getAllNotesMiddlewares[1]).toBe(findNotesMiddleware);
        expect(getAllNotesMiddlewares[2]).toBe(sendNotesMiddleware);
    });
});
