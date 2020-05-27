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

const name = 'Paint';
const description = 'Must sit down and paint for 30 minutes';
const icon = 'paint-brush';
const color = 'red';
const numberOfMinutes = 30;
const whatsappGroupLink = `https://whatsapp.com`;
const discordGroupLink = `https://discord.com`;

const body = {
    name,
    description,
    icon,
    color,
    whatsappGroupLink,
    discordGroupLink,
};

describe(`createChallengeBodyValidationMiddleware`, () => {
    test('check that valid request with all parameters passes', () => {
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
});

describe(`saveChallengeToDatabaseMiddleware`, () => {
    test('sets response.locals.challenge', async () => {
        expect.assertions(2);

        const save = jest.fn().mockResolvedValue(true);

        const challenge = jest.fn(() => ({ save }));

        const request: any = {
            body,
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getSaveChallengeToDatabaseMiddleware(challenge as any);

        await middleware(request, response, next);

        expect(response.locals.challenge).toBeDefined();
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

        const challenge = true;

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: { challenge }, status };
        const request: any = {};
        const next = jest.fn();

        sendFormattedChallengeMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.created);
        expect(send).toBeCalledWith({
            challenge,
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
