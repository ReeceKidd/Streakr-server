/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getFollowingMiddlewares,
    getRetrieveUserMiddleware,
    retrieveUserMiddleware,
    getFollowingParamsValidationMiddleware,
    sendFollowingMiddleware,
    retrieveFollowingInfoMiddleware,
    getRetrieveFollowingInfoMiddleware,
} from './getFollowingMiddlewares';
import { CustomError, ErrorType } from '../../../customError';

describe(`getFollowingMiddlewares`, () => {
    describe('getFollowingParamsValidationMiddleware', () => {
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

            getFollowingParamsValidationMiddleware(request, response, next);

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

            getFollowingParamsValidationMiddleware(request, response, next);

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

        test('throws GetFollowingUserDoesNotExistError when user does not exist', async () => {
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

            expect(next).toBeCalledWith(new CustomError(ErrorType.GetFollowingUserDoesNotExist));
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

    describe('retrieveFollowingInfoMiddleware', () => {
        test('maps over following and retrieves profile images.', async () => {
            expect.assertions(4);
            const lean = jest.fn(() => ({ profileImages: { originalImageUrl: 'google.com/image' } }));
            const findById = jest.fn(() => ({ lean }));
            const userModel = { findById };
            const userId = 'abcdefg';
            const following = [userId];
            const user = {
                following,
            };
            const request: any = { params: { userId } };
            const response: any = { locals: { user } };
            const next = jest.fn();
            const middleware = getRetrieveFollowingInfoMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(response.locals.following).toBeDefined();
            expect(findById).toBeCalledWith(userId);
            expect(lean).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('sets response.locals.following to an empty array if the person who the user was following no longer esits', async () => {
            expect.assertions(4);
            const lean = jest.fn(() => false);
            const findById = jest.fn(() => ({ lean }));
            const userModel = { findById };
            const userId = 'abcdefg';
            const following = [userId];
            const user = {
                following,
            };
            const request: any = { params: { userId } };
            const response: any = { locals: { user } };
            const next = jest.fn();
            const middleware = getRetrieveFollowingInfoMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(response.locals.following).toEqual([]);
            expect(findById).toBeCalledWith(userId);
            expect(lean).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws GetFollowingInfoMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const userId = 'abcd';
            const findOne = jest.fn(() => ({}));
            const userModel = { findOne };
            const request: any = { body: { userId } };
            const response: any = { status, locals: {} };
            const next = jest.fn();
            const middleware = getRetrieveFollowingInfoMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.GetFollowingInfoMiddleware, expect.any(Error)));
        });
    });

    describe('sendFollowingMiddleware', () => {
        test('sends following in response', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {};
            const following = [{ friendId: '123', username: 'username' }];
            const user = {
                following,
            };
            const response: any = { locals: { user }, status };
            const next = jest.fn();

            sendFollowingMiddleware(request, response, next);

            expect(next).not.toBeCalled();
            expect(status).toBeCalledWith(200);
            expect(send).toBeCalledWith(following);
        });

        test('calls next with SendFormattedFollowingMiddleware on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();

            sendFollowingMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.SendFormattedFollowingMiddleware, expect.any(Error)));
        });
    });

    test('middlewares are defined in the correct order', () => {
        expect.assertions(5);

        expect(getFollowingMiddlewares.length).toBe(4);

        expect(getFollowingMiddlewares[0]).toEqual(getFollowingParamsValidationMiddleware);
        expect(getFollowingMiddlewares[1]).toEqual(retrieveUserMiddleware);
        expect(getFollowingMiddlewares[2]).toEqual(retrieveFollowingInfoMiddleware);
        expect(getFollowingMiddlewares[3]).toEqual(sendFollowingMiddleware);
    });
});
