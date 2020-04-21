/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getAllChallengesMiddlewares,
    getChallengesQueryValidationMiddleware,
    getFindChallengesMiddleware,
    findChallengesMiddleware,
    sendChallengesMiddleware,
} from './getAllChallengesMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const name = 'name';

const query = {
    name,
};

describe('getChallengesValidationMiddleware', () => {
    test('passes valid request', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            query,
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getChallengesQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalledWith();
    });
});

describe('findChallengesMiddleware', () => {
    test('queries database with just name and sets response.locals.challenges with a sorted array of challenges', async () => {
        expect.assertions(4);
        const sort = jest.fn().mockResolvedValue(true);
        const find = jest.fn(() => ({ sort }));
        const challengeModel = {
            find,
        };
        const request: any = { query: { name } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindChallengesMiddleware(challengeModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ databaseName: { $regex: name.toLowerCase() } });
        expect(sort).toBeCalledWith({ numberOfMembers: -1 });
        expect(response.locals.challenges).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('calls next with FindChallengesMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getFindChallengesMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.FindChallengesMiddleware, expect.any(Error)));
    });
});

describe('sendChallengesMiddleware', () => {
    test('sends challenges in response', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const challenges = [
            {
                name,
            },
        ];
        const response: any = { locals: { challenges }, status };
        const next = jest.fn();

        sendChallengesMiddleware(request, response, next);

        expect.assertions(3);
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.success);
        expect(send).toBeCalledWith(challenges);
    });

    test('calls next with SendChallengesMiddleware on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        sendChallengesMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendChallengesMiddleware, expect.any(Error)));
    });
});

describe(`getAllChallengesMiddlewares`, () => {
    test('are in the correct order', async () => {
        expect.assertions(4);

        expect(getAllChallengesMiddlewares.length).toEqual(3);
        expect(getAllChallengesMiddlewares[0]).toBe(getChallengesQueryValidationMiddleware);
        expect(getAllChallengesMiddlewares[1]).toBe(findChallengesMiddleware);
        expect(getAllChallengesMiddlewares[2]).toBe(sendChallengesMiddleware);
    });
});
