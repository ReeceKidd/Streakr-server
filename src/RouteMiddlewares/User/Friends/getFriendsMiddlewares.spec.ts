/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getFriendsMiddlewares,
    getRetreiveUserMiddleware,
    retreiveUserMiddleware,
    getFriendsParamsValidationMiddleware,
    sendFriendsMiddleware,
    retreiveFriendsInfoMiddleware,
    getRetreiveFriendsInfoMiddleware,
} from './getFriendsMiddlewares';
import { CustomError, ErrorType } from '../../../customError';

describe(`getFriendsMiddlewares`, () => {
    describe('getFriendsParamsValidationMiddleware', () => {
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

            getFriendsParamsValidationMiddleware(request, response, next);

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

            getFriendsParamsValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(422);
            expect(send).toBeCalledWith({
                message: 'child "userId" fails because ["userId" must be a string]',
            });
            expect(next).not.toBeCalled();
        });
    });

    describe('retreiveUserMiddleware', () => {
        test('sets response.locals.user and calls next()', async () => {
            expect.assertions(4);
            const lean = jest.fn(() => true);
            const findOne = jest.fn(() => ({ lean }));
            const userModel = { findOne };
            const userId = 'abcdefg';
            const request: any = { params: { userId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getRetreiveUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(response.locals.user).toBeDefined();
            expect(findOne).toBeCalledWith({ _id: userId });
            expect(lean).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws GetFriendsUserDoesNotExistError when user does not exist', async () => {
            expect.assertions(1);
            const userId = '5d616c43e1dc592ce8bd487b';
            const lean = jest.fn(() => false);
            const findOne = jest.fn(() => ({ lean }));
            const userModel = { findOne };
            const request: any = { params: { userId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getRetreiveUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.GetFriendsUserDoesNotExist));
        });

        test('throws RetreiveUserMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const userId = 'abcd';
            const findOne = jest.fn(() => ({}));
            const userModel = { findOne };
            const request: any = { body: { userId } };
            const response: any = { status, locals: {} };
            const next = jest.fn();
            const middleware = getRetreiveUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.RetreiveUserMiddleware, expect.any(Error)));
        });
    });

    describe('retreiveFriendsInfoMiddleware', () => {
        test('maps over friends and retreives profile images.', async () => {
            expect.assertions(4);
            const lean = jest.fn(() => ({ profileImages: { originalImageUrl: 'google.com/image' } }));
            const findById = jest.fn(() => ({ lean }));
            const userModel = { findById };
            const userId = 'abcdefg';
            const friend = {
                friendId: 'friendId',
                username: 'username',
            };
            const friends = [friend];
            const user = {
                friends,
            };
            const request: any = { params: { userId } };
            const response: any = { locals: { user } };
            const next = jest.fn();
            const middleware = getRetreiveFriendsInfoMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(response.locals.friends).toBeDefined();
            expect(findById).toBeCalledWith(friend.friendId);
            expect(lean).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('sets response.locals.friends to an empty array if friend no longer esits', async () => {
            expect.assertions(4);
            const lean = jest.fn(() => false);
            const findById = jest.fn(() => ({ lean }));
            const userModel = { findById };
            const userId = 'abcdefg';
            const friend = {
                friendId: 'friendId',
                username: 'username',
            };
            const friends = [friend];
            const user = {
                friends,
            };
            const request: any = { params: { userId } };
            const response: any = { locals: { user } };
            const next = jest.fn();
            const middleware = getRetreiveFriendsInfoMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(response.locals.friends).toEqual([]);
            expect(findById).toBeCalledWith(friend.friendId);
            expect(lean).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws GetFriendsInfoMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const userId = 'abcd';
            const findOne = jest.fn(() => ({}));
            const userModel = { findOne };
            const request: any = { body: { userId } };
            const response: any = { status, locals: {} };
            const next = jest.fn();
            const middleware = getRetreiveFriendsInfoMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.GetFriendsInfoMiddleware, expect.any(Error)));
        });
    });

    describe('sendFriendsMiddleware', () => {
        test('sends friends in response', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {};
            const friends = [{ friendId: '123', username: 'username' }];
            const user = {
                friends,
            };
            const response: any = { locals: { user }, status };
            const next = jest.fn();

            sendFriendsMiddleware(request, response, next);

            expect(next).not.toBeCalled();
            expect(status).toBeCalledWith(200);
            expect(send).toBeCalledWith(friends);
        });

        test('calls next with SendFormattedFriendsMiddleware on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();

            sendFriendsMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.SendFormattedFriendsMiddleware, expect.any(Error)));
        });
    });

    test('middlewares are defined in the correct order', () => {
        expect.assertions(5);

        expect(getFriendsMiddlewares.length).toBe(4);

        expect(getFriendsMiddlewares[0]).toEqual(getFriendsParamsValidationMiddleware);
        expect(getFriendsMiddlewares[1]).toEqual(retreiveUserMiddleware);
        expect(getFriendsMiddlewares[2]).toEqual(retreiveFriendsInfoMiddleware);
        expect(getFriendsMiddlewares[3]).toEqual(sendFriendsMiddleware);
    });
});
