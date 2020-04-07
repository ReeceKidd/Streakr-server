/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import {
    createChallengeBodyValidationMiddleware,
    getSaveChallengeToDatabaseMiddleware,
    sendFormattedChallengeAndBadgeMiddleware,
    createChallengeMiddlewares,
    saveChallengeToDatabaseMiddleware,
    createBadgeForChallengeMiddleware,
    getCreateBadgeForChallengeMiddleware,
} from './createChallengeMiddlewares';
import { BadgeTypes } from '@streakoid/streakoid-sdk/lib';

describe(`createChallengeBodyValidationMiddleware`, () => {
    const name = 'Paint';
    const description = 'Must sit down and paint for 30 minutes';
    const icon = 'paint-brush';
    const color = 'red';
    const levels = [{ level: 0, criteria: 'criteria' }];
    const numberOfMinutes = 30;
    const whatsappGroupLink = `https://whatsapp.com`;
    const discordGroupLink = `https://discord.com`;

    const body = {
        name,
        description,
        icon,
        color,
        levels,
        whatsappGroupLink,
        discordGroupLink,
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

describe(`createBadgeForChallengeMiddleware`, () => {
    test('sets response.locals.savedBadge', async () => {
        expect.assertions(2);

        const name = 'Duolingo';
        const description = 'Daily Spanish';
        const icon = 'bird';

        const save = jest.fn().mockResolvedValue(true);

        const badge = jest.fn(() => ({ save }));

        const request: any = {
            body: { name, description, icon, badgeType: BadgeTypes.challenge },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getCreateBadgeForChallengeMiddleware(badge as any);

        await middleware(request, response, next);

        expect(response.locals.badge).toBeDefined();
        expect(save).toBeCalledWith();
    });

    test('calls next with CreateBadgeForChallengeMiddleware error on middleware failure', () => {
        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getCreateBadgeForChallengeMiddleware({} as any);

        middleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalledWith(new CustomError(ErrorType.CreateBadgeFromRequestMiddleware, expect.any(Error)));
    });
});

describe(`saveChallengeToDatabaseMiddleware`, () => {
    test('sets response.locals.savedChallenge', async () => {
        expect.assertions(2);

        const save = jest.fn().mockResolvedValue(true);

        const challenge = jest.fn(() => ({ save }));

        const badge = {
            _id: 'badgeId',
        };

        const request: any = {
            body: {},
        };
        const response: any = { locals: { badge } };
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

describe(`sendFormattedChallengeAndBadgeMiddleware`, () => {
    test('sends savedChallenge in request', () => {
        expect.assertions(3);

        const challenge = true;
        const badge = true;

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: { badge, challenge }, status };
        const request: any = {};
        const next = jest.fn();

        sendFormattedChallengeAndBadgeMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.created);
        expect(send).toBeCalledWith({
            badge,
            challenge,
        });
    });

    test('calls next with SendFormattedChallengeMiddlewar error on middleware failure', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        sendFormattedChallengeAndBadgeMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendFormattedChallengeMiddleware));
    });
});

describe(`createChallengeMiddlewares`, () => {
    test('are defined in the correct order', () => {
        expect.assertions(5);

        expect(createChallengeMiddlewares.length).toEqual(4);
        expect(createChallengeMiddlewares[0]).toBe(createChallengeBodyValidationMiddleware);
        expect(createChallengeMiddlewares[1]).toBe(createBadgeForChallengeMiddleware);
        expect(createChallengeMiddlewares[2]).toBe(saveChallengeToDatabaseMiddleware);
        expect(createChallengeMiddlewares[3]).toBe(sendFormattedChallengeAndBadgeMiddleware);
    });
});
