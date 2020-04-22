/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getAllChallengesMiddlewares,
    getChallengesQueryValidationMiddleware,
    findChallengesMiddleware,
    sendChallengesMiddleware,
    formChallengesQueryMiddleware,
    calculateChallengesCountMiddleware,
    getFindChallengesMiddleware,
} from './getAllChallengesMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { getCalculateTotalChallengesCountMiddleware } from '../Challenges/getAllChallengesMiddlewares';

const searchQuery = 'name';
const limit = 10;

const query = {
    searchQuery,
    limit,
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

describe('formChallengesQueryMiddleware', () => {
    test('sets response.locals.query using the searchQuery', () => {
        expect.assertions(2);
        const searchQuery = 'searchQuery';
        const request: any = { query: { searchQuery } };
        const response: any = {
            locals: {},
        };
        const next = jest.fn();

        formChallengesQueryMiddleware(request, response, next);

        expect(response.locals.query).toEqual({ databaseName: { $regex: searchQuery.toLowerCase() } });
        expect(next).toBeCalledWith();
    });

    test('sets response.locals.query with an empty query', () => {
        expect.assertions(2);
        const request: any = { query: {} };
        const response: any = {
            locals: {},
        };
        const next = jest.fn();

        formChallengesQueryMiddleware(request, response, next);

        expect(response.locals.query).toEqual({});
        expect(next).toBeCalledWith();
    });

    test('calls next with FormChallengesQueryMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        formChallengesQueryMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.FormChallengesQueryMiddleware, expect.any(Error)));
    });
});

describe('calculateTotalChallengesCountMiddleware', () => {
    test('sets response.header.x-total-count with the total challenges count', async () => {
        expect.assertions(2);
        const query = {};
        const totalCount = 10;
        const countDocuments = jest.fn().mockResolvedValue(totalCount);
        const find = jest.fn(() => ({ countDocuments }));
        const challengeModel = { find };
        const setHeader = jest.fn();
        const request: any = {};
        const response: any = {
            setHeader,
            locals: { query },
        };
        const next = jest.fn();

        const middleware = getCalculateTotalChallengesCountMiddleware(challengeModel as any);

        await middleware(request, response, next);

        expect(setHeader).toBeCalledWith('x-total-count', totalCount);
        expect(next).toBeCalledWith();
    });

    test('calls next with CalculateTotalChallengesCountMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getCalculateTotalChallengesCountMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CalculateTotalChallengesCountMiddleware, expect.any(Error)),
        );
    });
});

describe('findChallengesMiddleware', () => {
    test('sets response.locals.challenges with the limited number of challenges when limit query paramater is defined', async () => {
        expect.assertions(6);
        const name = 'Reading';
        const lean = jest.fn().mockResolvedValue([{ name }]);
        const limit = jest.fn(() => ({ lean }));
        const sort = jest.fn(() => ({ limit }));
        const find = jest.fn(() => ({ sort }));
        const challengeModel = { find };
        const request: any = { query: { limit: 10 } };
        const response: any = {
            locals: { query: {} },
        };
        const next = jest.fn();

        const middleware = getFindChallengesMiddleware(challengeModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({});
        expect(sort).toBeCalledWith({ numberOfMembers: -1 });
        expect(limit).toBeCalledWith(10);
        expect(lean).toBeCalledWith();
        expect(response.locals.challenges).toEqual([{ name }]);
        expect(next).toBeCalledWith();
    });

    test('sets response.locals.challenges with all challenges when no limit is defined', async () => {
        expect.assertions(5);
        const name = 'Reading';
        const lean = jest.fn().mockResolvedValue([{ name }]);
        const sort = jest.fn(() => ({ lean }));
        const find = jest.fn(() => ({ sort }));
        const challengeModel = { find };
        const request: any = { query: {} };
        const response: any = {
            locals: { query: {} },
        };
        const next = jest.fn();

        const middleware = getFindChallengesMiddleware(challengeModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({});
        expect(sort).toBeCalledWith({ numberOfMembers: -1 });
        expect(lean).toBeCalledWith();
        expect(response.locals.challenges).toEqual([{ name }]);
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
                name: 'Reading',
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
        expect.assertions(6);

        expect(getAllChallengesMiddlewares.length).toEqual(5);
        expect(getAllChallengesMiddlewares[0]).toBe(getChallengesQueryValidationMiddleware);
        expect(getAllChallengesMiddlewares[1]).toBe(formChallengesQueryMiddleware);
        expect(getAllChallengesMiddlewares[2]).toBe(calculateChallengesCountMiddleware);
        expect(getAllChallengesMiddlewares[3]).toBe(findChallengesMiddleware);
        expect(getAllChallengesMiddlewares[4]).toBe(sendChallengesMiddleware);
    });
});
