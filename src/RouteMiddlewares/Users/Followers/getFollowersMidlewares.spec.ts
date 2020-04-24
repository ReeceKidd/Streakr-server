/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getFollowersMiddlewares,
    getRetrieveUserMiddleware,
    retrieveUserMiddleware,
    getFollowersParamsValidationMiddleware,
    sendFollowersMiddleware,
    retrieveFollowersInfoMiddleware,
    getRetrieveFollowersInfoMiddleware,
} from './getFollowersMiddlewares';
import { CustomError, ErrorType } from '../../../customError';

describe(`getFollowersMiddlewares`, () => {
    describe('getFollowersParamsValidationMiddleware', () => {
        test('sends userId is not defined error', () => {
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

            getFollowersParamsValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(422);
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
                params: { userId: 123 },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            getFollowersParamsValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(422);
            expect(send).toBeCalledWith({
                message: 'child "userId" fails because ["userId" must be a string]',
            });
            expect(next).not.toBeCalled();
        });
    });

    describe('retrieveUserMiddleware', () => {
        test('sets response.locals.user and calls next()', async () => {
            expect.assertions(4);
            const lean = jest.fn(() => true);
            const findOne = jest.fn(() => ({ lean }));
            const userModel = { findOne };
            const userId = 'abcdefg';
            const request: any = { params: { userId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getRetrieveUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(response.locals.user).toBeDefined();
            expect(findOne).toBeCalledWith({ _id: userId });
            expect(lean).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws GetFollowersUserDoesNotExistError when user does not exist', async () => {
            expect.assertions(1);
            const userId = '5d616c43e1dc592ce8bd487b';
            const lean = jest.fn(() => false);
            const findOne = jest.fn(() => ({ lean }));
            const userModel = { findOne };
            const request: any = { params: { userId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getRetrieveUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.GetFollowersUserDoesNotExist));
        });

        test('throws RetrieveUserMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const userId = 'abcd';
            const findOne = jest.fn(() => ({}));
            const userModel = { findOne };
            const request: any = { body: { userId } };
            const response: any = { status, locals: {} };
            const next = jest.fn();
            const middleware = getRetrieveUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.RetrieveUserMiddleware, expect.any(Error)));
        });
    });

    describe('retrieveFollowersInfoMiddleware', () => {
        test('maps over followers and retrieves profile images and username.', async () => {
            expect.assertions(4);
            const lean = jest.fn(() => ({ profileImages: { originalImageUrl: 'google.com/image' } }));
            const findById = jest.fn(() => ({ lean }));
            const userModel = { findById };
            const userId = 'abcdefg';
            const followers = [userId];
            const user = {
                followers,
            };
            const request: any = { params: { userId } };
            const response: any = { locals: { user } };
            const next = jest.fn();
            const middleware = getRetrieveFollowersInfoMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(response.locals.followers).toBeDefined();
            expect(findById).toBeCalledWith(userId);
            expect(lean).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('sets response.locals.followers to an empty array if the person who the user was followers no longer esits', async () => {
            expect.assertions(4);
            const lean = jest.fn(() => false);
            const findById = jest.fn(() => ({ lean }));
            const userModel = { findById };
            const userId = 'abcdefg';
            const followers = [userId];
            const user = {
                followers,
            };
            const request: any = { params: { userId } };
            const response: any = { locals: { user } };
            const next = jest.fn();
            const middleware = getRetrieveFollowersInfoMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(response.locals.followers).toEqual([]);
            expect(findById).toBeCalledWith(userId);
            expect(lean).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws GetFollowersInfoMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const userId = 'abcd';
            const findOne = jest.fn(() => ({}));
            const userModel = { findOne };
            const request: any = { body: { userId } };
            const response: any = { status, locals: {} };
            const next = jest.fn();
            const middleware = getRetrieveFollowersInfoMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.GetFollowersInfoMiddleware, expect.any(Error)));
        });
    });

    describe('sendFollowersMiddleware', () => {
        test('sends followers in response', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {};
            const followers = [{ username: 'username' }];
            const user = {
                followers,
            };
            const response: any = { locals: { user }, status };
            const next = jest.fn();

            sendFollowersMiddleware(request, response, next);

            expect(next).not.toBeCalled();
            expect(status).toBeCalledWith(200);
            expect(send).toBeCalledWith(followers);
        });

        test('calls next with SendFormattedFollowersMiddleware on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();

            sendFollowersMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.SendFormattedFollowersMiddleware, expect.any(Error)));
        });
    });

    test('middlewares are defined in the correct order', () => {
        expect.assertions(5);

        expect(getFollowersMiddlewares.length).toBe(4);

        expect(getFollowersMiddlewares[0]).toEqual(getFollowersParamsValidationMiddleware);
        expect(getFollowersMiddlewares[1]).toEqual(retrieveUserMiddleware);
        expect(getFollowersMiddlewares[2]).toEqual(retrieveFollowersInfoMiddleware);
        expect(getFollowersMiddlewares[3]).toEqual(sendFollowersMiddleware);
    });
});
