/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    challengeParamsValidationMiddleware,
    getRetreiveChallengeMiddleware,
    sendChallengeMiddleware,
    getOneChallengeMiddlewares,
    retreiveChallengeMiddleware,
    getRetreiveChallengeMemberInformationMiddleware,
    retreiveChallengeMemberInformationMiddleware,
} from '../Challenges/getOneChallengeMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { ErrorType, CustomError } from '../../customError';

describe(`challengeParamsValidationMiddleware`, () => {
    const challengeId = '5d43f0c2f4499975cb312b72';

    test('calls next() when correct params are supplied', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { challengeId },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        challengeParamsValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends error response when challengeId is missing', () => {
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

        challengeParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "challengeId" fails because ["challengeId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends error response when challengeId is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { challengeId: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        challengeParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "challengeId" fails because ["challengeId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends error response when challengeId is not 24 characters in length', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { challengeId: '1234567' },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        challengeParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "challengeId" fails because ["challengeId" length must be 24 characters long]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('retreiveChallengeMiddleware', () => {
    test('sets response.locals.challenge', async () => {
        expect.assertions(3);
        const lean = jest.fn().mockResolvedValue(true);
        const findOne = jest.fn(() => ({ lean }));
        const challengeModel = {
            findOne,
        };
        const challengeId = 'abcd';
        const request: any = { params: { challengeId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveChallengeMiddleware(challengeModel as any);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ _id: challengeId });
        expect(response.locals.challenge).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws NoChallengeFound when challenge is not found', async () => {
        expect.assertions(1);
        const lean = jest.fn().mockResolvedValue(false);
        const findOne = jest.fn(() => ({ lean }));
        const challengeModel = {
            findOne,
        };
        const challengeId = 'abcd';
        const request: any = { params: { challengeId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveChallengeMiddleware(challengeModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.NoChallengeFound, expect.any(Error)));
    });

    test('calls next with GetRetreiveChallengeMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getRetreiveChallengeMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.GetRetreiveChallengeMiddleware, expect.any(Error)));
    });
});

describe('getChallengeMemberInformationMiddleware', () => {
    test('sets response.locals.challenge with populated members', async () => {
        expect.assertions(3);
        const findById = jest.fn().mockResolvedValue({
            username: 'username',
            _id: '_id',
            profileImages: { originalImageUrl: 'originalImageUrl' },
        });
        const userModel = {
            findById,
        };
        const members = ['member'];
        const challenge = { members };
        const request: any = {};
        const response: any = { locals: { challenge } };
        const next = jest.fn();
        const middleware = getRetreiveChallengeMemberInformationMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(findById).toBeCalledWith('member');
        expect(response.locals.challenge).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('calls next with GetRetreiveChallengeMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getRetreiveChallengeMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.GetRetreiveChallengeMiddleware, expect.any(Error)));
    });
});

describe('sendChallengeMiddleware', () => {
    test('sends challenge', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const challenge = { _id: 'abc' };
        const request: any = {};
        const response: any = { locals: { challenge }, status };
        const next = jest.fn();

        sendChallengeMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(200);
        expect(send).toBeCalledWith(challenge);
    });

    test('calls next with SendRetreiveChallengeResponseMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const error = 'error';
        const send = jest.fn(() => Promise.reject(error));
        const status = jest.fn(() => ({ send }));
        const response: any = { status };
        const next = jest.fn();

        await sendChallengeMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendChallengeMiddleware, expect.any(Error)));
    });
});

describe('getOneChallengeMiddlewares', () => {
    test('are defined in the correct order', () => {
        expect.assertions(5);

        expect(getOneChallengeMiddlewares.length).toEqual(4);
        expect(getOneChallengeMiddlewares[0]).toEqual(challengeParamsValidationMiddleware);
        expect(getOneChallengeMiddlewares[1]).toEqual(retreiveChallengeMiddleware);
        expect(getOneChallengeMiddlewares[2]).toEqual(retreiveChallengeMemberInformationMiddleware);
        expect(getOneChallengeMiddlewares[3]).toEqual(sendChallengeMiddleware);
    });
});
