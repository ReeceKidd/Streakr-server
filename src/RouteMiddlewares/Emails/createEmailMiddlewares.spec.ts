/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createEmailMiddlewares,
    createEmailBodyValidationMiddleware,
    createEmailFromRequestMiddleware,
    getCreateEmailFromRequestMiddleware,
    saveEmailToDatabaseMiddleware,
    sendEmailMiddleware,
    emailSentResponseMiddleware,
    getSendEmailMiddleware,
} from './createEmailMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe(`createEmailBodyValidationMiddleware`, () => {
    const name = 'John';
    const email = 'john@test.com';
    const message = 'Support request';
    const userId = 'userId';
    const username = 'username';

    const body = {
        name,
        email,
        message,
        userId,
        username,
    };

    test('valid request with all params passes validation', () => {
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

        createEmailBodyValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('valid request with just required params validation', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: {
                name,
                email,
                message,
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createEmailBodyValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends name is missing error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, name: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createEmailBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "name" fails because ["name" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends email is missing error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, email: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createEmailBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "email" fails because ["email" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends message is missing error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, message: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createEmailBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "message" fails because ["message" is required]',
        });
        expect(next).not.toBeCalled();
    });
});

describe(`createEmailFromRequestMiddleware`, () => {
    test('sets response.locals.newEmail', async () => {
        expect.assertions(2);

        const name = 'John';
        const email = 'john@test.com';
        const message = 'Support request';
        const userId = 'userId';
        const username = 'username';

        class Email {
            name: string;
            email: string;
            message: string;
            userId: string;
            username: string;

            constructor({ name, email, message, userId, username }: any) {
                this.name = name;
                this.email = email;
                this.message = message;
                this.userId = userId;
                this.username = username;
            }
        }
        const response: any = { locals: {} };
        const request: any = {
            body: { name, email, message, userId, username },
        };
        const next = jest.fn();
        const newEmail = new Email({
            name,
            email,
            message,
            userId,
            username,
        });
        const middleware = getCreateEmailFromRequestMiddleware(Email as any);

        middleware(request, response, next);

        expect(response.locals.newEmail).toEqual(newEmail);
        expect(next).toBeCalledWith();
    });

    test('calls next with CreateEmailFromRequestMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const timezone = 'Europe/London';
        const userId = 'abcdefg';
        const name = 'streak name';
        const description = 'mock streak description';
        const response: any = { locals: { timezone } };
        const request: any = { body: { userId, name, description } };
        const next = jest.fn();
        const middleware = getCreateEmailFromRequestMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.CreateEmailFromRequestMiddleware, expect.any(Error)));
    });
});

describe(`saveEmailToDatabaseMiddleware`, () => {
    const ERROR_MESSAGE = 'error';

    test('sets response.locals.email', async () => {
        expect.assertions(3);
        const save = jest.fn().mockResolvedValue(true);
        const mockEmail = {
            userId: 'abcdefg',
            email: 'user@gmail.com',
            save,
        } as any;
        const response: any = { locals: { newEmail: mockEmail } };
        const request: any = {};
        const next = jest.fn();

        await saveEmailToDatabaseMiddleware(request, response, next);

        expect(save).toBeCalled();
        expect(response.locals.email).toBeDefined();
        expect(next).toBeCalled();
    });

    test('calls next with SaveEmailToDatabaseMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const save = jest.fn(() => {
            return Promise.reject(ERROR_MESSAGE);
        });
        const request: any = {};
        const response: any = { locals: { newEmail: { save } } };
        const next = jest.fn();

        await saveEmailToDatabaseMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SaveEmailToDatabaseMiddleware, expect.any(Error)));
    });
});

describe(`sendEmailMiddleware`, () => {
    test('sends an email with sendEmailFunction', async () => {
        expect.assertions(2);
        const sendEmail = jest.fn().mockResolvedValue(true);
        const name = 'John';
        const email = 'john@test.com';
        const message = 'Support request';
        const userId = 'userId';
        const username = 'username';
        const response: any = { locals: { email: { name, email, message, userId, username } } };
        const request: any = {};
        const next = jest.fn();

        const middleware = getSendEmailMiddleware(sendEmail);
        await middleware(request, response, next);

        expect(sendEmail).toBeCalledWith('Support', expect.any(String));
        expect(next).toBeCalled();
    });

    test('calls next with SendEmailMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        emailSentResponseMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendEmailMiddleware, expect.any(Error)));
    });
});

describe(`emailSentResponseMiddleware`, () => {
    test('responds with email and status 201', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const email = {
            name: 'John Doe',
        };
        const response: any = { locals: { email }, status };
        const request: any = {};
        const next = jest.fn();

        emailSentResponseMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.created);
        expect(send).toBeCalledWith(email);
    });

    test('calls next with SendFormattedEmailMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        emailSentResponseMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.EmailSentResponseMiddleware, expect.any(Error)));
    });
});

describe(`createEmailMiddlewares`, () => {
    test('are defined in the correct order', async () => {
        expect.assertions(6);

        expect(createEmailMiddlewares.length).toEqual(5);
        expect(createEmailMiddlewares[0]).toBe(createEmailBodyValidationMiddleware);
        expect(createEmailMiddlewares[1]).toBe(createEmailFromRequestMiddleware);
        expect(createEmailMiddlewares[2]).toBe(saveEmailToDatabaseMiddleware);
        expect(createEmailMiddlewares[3]).toBe(sendEmailMiddleware);
        expect(createEmailMiddlewares[4]).toBe(emailSentResponseMiddleware);
    });
});
