import {
    unfollowUserMiddlewares,
    unfollowUserParamsValidationMiddleware,
    doesUserToUnfollowExistInSelectedUsersFollowingMiddleware,
    unfollowUserMiddleware,
    deleteSelectedUserFromUserToUnfollowFollowersMiddleware,
    sendUserUnfollowedResponseMiddleware,
    retrieveSelectedUserMiddleware,
    getRetrieveSelectedUserMiddleware,
    getUnfollowUserMiddleware,
    getDeleteSelectedUserFromUserToUnfollowFollowersMiddleware,
} from './unfollowUserMiddlewares';
import { CustomError } from '../../../../src/customError';
import { ErrorType } from '../../../../src/customError';

/* eslint-disable @typescript-eslint/no-explicit-any */

describe('unfollowUserMiddlewares', () => {
    describe(`unfollowUserParamsValidationMiddleware`, () => {
        const userId = '5d43f0c2f4499975cb312b72';
        const userToUnfollowId = '5d43f0c2f4499975cb312b7a';

        test('calls next() when correct params are supplied', () => {
            expect.assertions(1);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                params: { userId, userToUnfollowId },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            unfollowUserParamsValidationMiddleware(request, response, next);

            expect(next).toBeCalled();
        });

        test('sends error response when userId is missing', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                params: { userToUnfollowId },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            unfollowUserParamsValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(422);
            expect(send).toBeCalledWith({
                message: 'child "userId" fails because ["userId" is required]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends error response when userId is not a string', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                params: { userId: 1234, userToUnfollowId },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            unfollowUserParamsValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(422);
            expect(send).toBeCalledWith({
                message: 'child "userId" fails because ["userId" must be a string]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends error response when userId is not 24 characters in length', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                params: { userId: '1234567' },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            unfollowUserParamsValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(422);
            expect(send).toBeCalledWith({
                message: 'child "userId" fails because ["userId" length must be 24 characters long]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends error response when userToUnfollowId is missing', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                params: { userId },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            unfollowUserParamsValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(422);
            expect(send).toBeCalledWith({
                message: 'child "userToUnfollowId" fails because ["userToUnfollowId" is required]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends error response when userToUnfollowId is not a string', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                params: { userId, userToUnfollowId: 1234 },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            unfollowUserParamsValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(422);
            expect(send).toBeCalledWith({
                message: 'child "userToUnfollowId" fails because ["userToUnfollowId" must be a string]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends error response when userToUnfollowId is not 24 characters in length', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                params: { userId, userToUnfollowId: '1234567' },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            unfollowUserParamsValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(422);
            expect(send).toBeCalledWith({
                message:
                    'child "userToUnfollowId" fails because ["userToUnfollowId" length must be 24 characters long]',
            });
            expect(next).not.toBeCalled();
        });
    });

    describe('retrieveSelectedUserMiddleware', () => {
        test('sets response.locals.user and calls next()', async () => {
            expect.assertions(4);
            const lean = jest.fn(() => true);
            const findOne = jest.fn(() => ({ lean }));
            const userModel = { findOne };
            const userId = 'abcdefg';
            const request: any = { params: { userId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getRetrieveSelectedUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(response.locals.user).toBeDefined();
            expect(findOne).toBeCalledWith({ _id: userId });
            expect(lean).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws UnfollowUserNoSelectedUserFound when user does not exist', async () => {
            expect.assertions(1);
            const userId = 'abcd';
            const lean = jest.fn(() => false);
            const findOne = jest.fn(() => ({ lean }));
            const userModel = { findOne };
            const request: any = { params: { userId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getRetrieveSelectedUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.UnfollowUserNoSelectedUserFound));
        });

        test('throws UnfollowUserRetrieveSelectedUserMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getRetrieveSelectedUserMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.UnfollowUserRetrieveSelectedUserMiddleware, expect.any(Error)),
            );
        });
    });

    describe('doesUserToUnfollowExistInSelectedUsersFollowingMiddleware', () => {
        test('calls next() if userToUnfollow exists', () => {
            expect.assertions(1);

            const userToUnfollowId = 'userToUnfollowId';
            const user = {
                following: [userToUnfollowId],
            };
            const request: any = { params: { userToUnfollowId } };
            const response: any = { locals: { user } };
            const next = jest.fn();

            doesUserToUnfollowExistInSelectedUsersFollowingMiddleware(request, response, next);

            expect(next).toBeCalledWith();
        });

        test('throws UserToUnfollowDoesNotExistInSelectedUsersFollowing if the user to unfollow does not exist in the selected users following', () => {
            expect.assertions(1);

            const userToUnfollowId = 'userToUnfollowId';
            const user = {
                following: [],
            };
            const request: any = { params: { userToUnfollowId } };
            const response: any = { locals: { user } };
            const next = jest.fn();

            doesUserToUnfollowExistInSelectedUsersFollowingMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.UserToUnfollowDoesNotExistInSelectedUsersFollowing));
        });

        test('throws DoesUserToUnfollowExistInSelectedUsersFollowingMiddleware error on middleware failure', async () => {
            expect.assertions(1);

            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            await doesUserToUnfollowExistInSelectedUsersFollowingMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.DoesUserToUnfollowExistInSelectedUsersFollowingMiddleware, expect.any(Error)),
            );
        });
    });

    describe('unfollowUserMiddleware', () => {
        test('removes userToUnfollowId from selected users following', async () => {
            expect.assertions(3);

            const userId = 'userId';
            const userToUnfollowId = 'userToUnfollowId';
            const lean = jest.fn().mockResolvedValue({ following: [] });
            const findByIdAndUpdate = jest.fn(() => ({ lean }));
            const userModel: any = { findByIdAndUpdate };

            const request: any = { params: { userId, userToUnfollowId } };
            const response: any = { locals: {} };
            const next = jest.fn();

            const middleware = getUnfollowUserMiddleware(userModel);
            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                userId,
                {
                    $pull: { following: userToUnfollowId },
                },
                { new: true },
            );
            expect(response.locals.updatedFollowing).toEqual([]);
            expect(next).toBeCalledWith();
        });

        test('calls next with UnfollowUserMiddleware on middleware failure', async () => {
            expect.assertions(1);

            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            const middleware = getUnfollowUserMiddleware({} as any);
            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.UnfollowUserMiddleware, expect.any(Error)));
        });
    });

    describe('deleteSelectedUserFromUserToUnfollowFollowersMiddleware', () => {
        test('removes selected user from userToUnfollow followers', async () => {
            expect.assertions(2);

            const userId = 'userId';
            const userToUnfollowId = 'userToUnfollowId';
            const findByIdAndUpdate = jest.fn().mockResolvedValue(true);
            const userModel: any = { findByIdAndUpdate };

            const request: any = { params: { userId, userToUnfollowId } };
            const response: any = { locals: {} };
            const next = jest.fn();

            const middleware = getDeleteSelectedUserFromUserToUnfollowFollowersMiddleware(userModel);
            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(userToUnfollowId, {
                $pull: { followers: userId },
            });
            expect(next).toBeCalledWith();
        });

        test('calls next with .DeleteSelectedUserFromUserToUnfollowFollowersMiddleware on middleware failure', async () => {
            expect.assertions(1);

            const request: any = { params: {} };
            const response: any = {};
            const next = jest.fn();

            const middleware = getDeleteSelectedUserFromUserToUnfollowFollowersMiddleware({} as any);
            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.DeleteSelectedUserFromUserToUnfollowFollowersMiddleware, expect.any(Error)),
            );
        });
    });

    describe('sendUserUnfollowedResponseMiddleware', () => {
        test('sends updated following array', () => {
            expect.assertions(3);
            const updatedFollowing: any = [];
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {};
            const response: any = { status, locals: { updatedFollowing } };
            const next = jest.fn();

            sendUserUnfollowedResponseMiddleware(request, response, next);

            expect(status).toBeCalledWith(200);
            expect(send).toBeCalledWith(updatedFollowing);
            expect(next).not.toBeCalled();
        });

        test('that on error next is called with error', () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            sendUserUnfollowedResponseMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.SendUserUnfollowedResponseMiddleware, expect.any(Error)),
            );
        });
    });

    test('middlewares are defined in the correct order', () => {
        expect.assertions(7);

        expect(unfollowUserMiddlewares.length).toEqual(6);

        expect(unfollowUserMiddlewares[0]).toEqual(unfollowUserParamsValidationMiddleware);
        expect(unfollowUserMiddlewares[1]).toEqual(retrieveSelectedUserMiddleware);
        expect(unfollowUserMiddlewares[2]).toEqual(doesUserToUnfollowExistInSelectedUsersFollowingMiddleware);
        expect(unfollowUserMiddlewares[3]).toEqual(unfollowUserMiddleware);
        expect(unfollowUserMiddlewares[4]).toEqual(deleteSelectedUserFromUserToUnfollowFollowersMiddleware);
        expect(unfollowUserMiddlewares[5]).toEqual(sendUserUnfollowedResponseMiddleware);
    });
});
