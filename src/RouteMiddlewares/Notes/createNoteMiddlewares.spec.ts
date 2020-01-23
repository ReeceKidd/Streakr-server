/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createNoteMiddlewares,
    createNoteBodyValidationMiddleware,
    createNoteFromRequestMiddleware,
    getCreateNoteFromRequestMiddleware,
    sendFormattedNoteMiddleware,
} from './createNoteMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const userId = '12345678';
const streakId = 'abcdefghijk';
const text = 'Completed Spanish lesson on Duolingo';

describe(`createNoteBodyValidationMiddleware`, () => {
    const body = {
        userId,
        streakId,
        text,
    };

    test('valid request passes validation', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body,
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createNoteBodyValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends userId is missing error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, userId: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createNoteBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends userId is not a string error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, userId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createNoteBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends streakId is missing error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, streakId: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createNoteBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "streakId" fails because ["streakId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends streakId is not a string error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, streakId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createNoteBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "streakId" fails because ["streakId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends text is not a string error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, text: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createNoteBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "text" fails because ["text" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe(`createNoteFromRequestMiddleware`, () => {
    test('sets response.locals.savedNote', async () => {
        expect.assertions(2);

        const save = jest.fn().mockResolvedValue(true);

        const note = jest.fn(() => ({ save }));

        const response: any = { locals: {} };
        const request: any = { body: { userId, streakId, note } };
        const next = jest.fn();

        const middleware = getCreateNoteFromRequestMiddleware(note as any);

        await middleware(request, response, next);

        expect(response.locals.savedNote).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('calls next with CreateNoteFromRequestMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getCreateNoteFromRequestMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.CreateNoteFromRequestMiddleware, expect.any(Error)));
    });
});

describe(`sendFormattedNoteMiddleware`, () => {
    const ERROR_MESSAGE = 'error';
    const savedNote = {
        userId: 'abc',
        streakName: 'Daily Spanish',
        streakDescription: 'Practice spanish every day',
        startDate: new Date(),
    };

    test('responds with status 201 with note', () => {
        expect.assertions(4);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const noteResponseLocals = {
            savedNote,
        };
        const response: any = { locals: noteResponseLocals, status };
        const request: any = {};
        const next = jest.fn();

        sendFormattedNoteMiddleware(request, response, next);

        expect(response.locals.user).toBeUndefined();
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.created);
        expect(send).toBeCalledWith(savedNote);
    });

    test('calls next with SendFormattedNoteMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: { savedNote }, status };

        const request: any = {};
        const next = jest.fn();

        sendFormattedNoteMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendFormattedNoteMiddleware, expect.any(Error)));
    });
});

describe(`createNoteMiddlewares`, () => {
    test('that createNote middlewares are defined in the correct order', async () => {
        expect.assertions(4);

        expect(createNoteMiddlewares.length).toEqual(3);
        expect(createNoteMiddlewares[0]).toBe(createNoteBodyValidationMiddleware);
        expect(createNoteMiddlewares[1]).toBe(createNoteFromRequestMiddleware);
        expect(createNoteMiddlewares[2]).toBe(sendFormattedNoteMiddleware);
    });
});
