/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    badgeParamsValidationMiddleware,
    getRetreiveBadgeMiddleware,
    sendBadgeMiddleware,
    getOneBadgeMiddlewares,
    retreiveBadgeMiddleware,
} from '../Badges/getOneBadgeMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { ErrorType, CustomError } from '../../customError';

describe(`badgeParamsValidationMiddleware`, () => {
    const badgeId = '5d43f0c2f4499975cb312b72';

    test('calls next() when correct params are supplied', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { badgeId },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        badgeParamsValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends error response when badgeId is missing', () => {
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

        badgeParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "badgeId" fails because ["badgeId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends error response when badgeId is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { badgeId: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        badgeParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "badgeId" fails because ["badgeId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends error response when badgeId is not 24 characters in length', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { badgeId: '1234567' },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        badgeParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "badgeId" fails because ["badgeId" length must be 24 characters long]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('retreiveBadgeMiddleware', () => {
    test('sets response.locals.badge', async () => {
        expect.assertions(3);
        const lean = jest.fn().mockResolvedValue(true);
        const findOne = jest.fn(() => ({ lean }));
        const badgeModel = {
            findOne,
        };
        const badgeId = 'abcd';
        const request: any = { params: { badgeId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveBadgeMiddleware(badgeModel as any);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ _id: badgeId });
        expect(response.locals.badge).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws NoBadgeFound when badge is not found', async () => {
        expect.assertions(1);
        const lean = jest.fn().mockResolvedValue(false);
        const findOne = jest.fn(() => ({ lean }));
        const badgeModel = {
            findOne,
        };
        const badgeId = 'abcd';
        const request: any = { params: { badgeId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveBadgeMiddleware(badgeModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.NoBadgeFound, expect.any(Error)));
    });

    test('calls next with GetRetreiveBadgeMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getRetreiveBadgeMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.GetRetreiveBadgeMiddleware, expect.any(Error)));
    });
});

describe('sendBadgeMiddleware', () => {
    test('sends badge', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const badge = { _id: 'abc' };
        const request: any = {};
        const response: any = { locals: { badge }, status };
        const next = jest.fn();

        sendBadgeMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(200);
        expect(send).toBeCalledWith(badge);
    });

    test('calls next with SendRetreiveBadgeResponseMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const error = 'error';
        const send = jest.fn(() => Promise.reject(error));
        const status = jest.fn(() => ({ send }));
        const response: any = { status };
        const next = jest.fn();

        await sendBadgeMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendBadgeMiddleware, expect.any(Error)));
    });
});

describe('getOneBadgeMiddlewares', () => {
    test('are defined in the correct order', () => {
        expect.assertions(4);

        expect(getOneBadgeMiddlewares.length).toEqual(3);
        expect(getOneBadgeMiddlewares[0]).toEqual(badgeParamsValidationMiddleware);
        expect(getOneBadgeMiddlewares[1]).toEqual(retreiveBadgeMiddleware);
        expect(getOneBadgeMiddlewares[2]).toEqual(sendBadgeMiddleware);
    });
});
