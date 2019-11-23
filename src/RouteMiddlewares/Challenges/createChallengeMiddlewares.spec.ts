/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import {
    createChallengeBodyValidationMiddleware,
    getSaveChallengeToDatabaseMiddleware,
    sendFormattedChallengeMiddleware,
    createChallengeMiddlewares,
    saveChallengeToDatabaseMiddleware,
} from './createChallengeMiddlewares';

describe(`createChallengeBodyValidationMiddleware`, () => {
    const name = 'Paint';
    const description = 'Must sit down and paint for 30 minutes';
    const icon = 'paint-brush';
    const color = 'red';
    const levels = [{ level: 0, badgeId: 'badgeId', criteria: 'criteria' }];
    const numberOfMinutes = 30;

    const body = {
        name,
        description,
        icon,
        color,
        levels,
    };

    test('check that valid request with all paramaters passes', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: {
                ...body,
                numberOfMinutes,
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createChallengeBodyValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('check that valid request with minimum paramaters passes', () => {
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

        createChallengeBodyValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends correct error response when name is missing', () => {
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

        createChallengeBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "name" fails because ["name" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when description is missing', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, description: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createChallengeBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "description" fails because ["description" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when icon is missing', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, icon: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createChallengeBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "icon" fails because ["icon" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when color is missing', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, color: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createChallengeBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "color" fails because ["color" is required]',
        });
        expect(next).not.toBeCalled();
    });
});

describe(`saveChallengeToDatabaseMiddleware`, () => {
    test('sets response.locals.savedChallenge', async () => {
        expect.assertions(2);

        const save = jest.fn().mockResolvedValue(true);

        const challenge = jest.fn(() => ({ save }));

        const request: any = {
            body: {},
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getSaveChallengeToDatabaseMiddleware(challenge as any);

        await middleware(request, response, next);

        expect(response.locals.savedChallenge).toBeDefined();
        expect(save).toBeCalledWith();
    });

    test('calls next with CreateChallengeFromRequestMiddleware error on middleware failure', () => {
        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getSaveChallengeToDatabaseMiddleware({} as any);

        middleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalledWith(new CustomError(ErrorType.CreateChallengeFromRequestMiddleware, expect.any(Error)));
    });
});

describe(`sendFormattedChallengeMiddleware`, () => {
    test('sends savedChallenge in request', () => {
        expect.assertions(3);
        const name = 'Paint';
        const description = 'Must sit down and paint for 30 minutes';
        const icon = 'paint-brush';
        const level = {
            level: 0,
            color: 'red',
            criteria: '30 days in a row',
        };
        const levels = [level];

        const savedChallenge = {
            name,
            description,
            icon,
            levels,
        };

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: { savedChallenge }, status };
        const request: any = {};
        const next = jest.fn();

        sendFormattedChallengeMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.created);
        expect(send).toBeCalledWith({
            name,
            description,
            icon,
            levels,
        });
    });

    test('calls next with SendFormattedChallengeMiddlewar error on middleware failure', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        sendFormattedChallengeMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendFormattedChallengeMiddleware));
    });
});

describe(`createChallengeMiddlewares`, () => {
    test('are defined in the correct order', () => {
        expect.assertions(4);

        expect(createChallengeMiddlewares.length).toEqual(3);
        expect(createChallengeMiddlewares[0]).toBe(createChallengeBodyValidationMiddleware);
        expect(createChallengeMiddlewares[1]).toBe(saveChallengeToDatabaseMiddleware);
        expect(createChallengeMiddlewares[2]).toBe(sendFormattedChallengeMiddleware);
    });
});
