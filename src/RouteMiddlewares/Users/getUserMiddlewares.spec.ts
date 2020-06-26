/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    userParamsValidationMiddleware,
    getRetrieveUserMiddleware,
    sendUserMiddleware,
    getUserMiddlewares,
    retrieveUserMiddleware,
    formatUserMiddleware,
    getPopulateUserFollowersMiddleware,
    getPopulateUserFollowingMiddleware,
    populateUserFollowersMiddleware,
    populateUserFollowingMiddleware,
    populateUserAchievementsMiddleware,
    getPopulateUserAchievementsMiddleware,
} from '../Users/getUserMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { ErrorType, CustomError } from '../../customError';
import { UserAchievement } from '@streakoid/streakoid-models/lib/Models/UserAchievement';
import AchievementTypes from '@streakoid/streakoid-models/lib/Types/AchievementTypes';
import { getMockUser } from '../../testHelpers/getMockUser';

describe(`userParamsValidationMiddleware`, () => {
    const userId = '5d43f0c2f4499975cb312b72';

    test('calls next() when correct params are supplied', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { userId },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        userParamsValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends error response when userId is missing', () => {
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

        userParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
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
            params: { userId: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        userParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
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

        userParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" length must be 24 characters long]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('retrieveUserMiddleware', () => {
    test('sets response.locals.user', async () => {
        expect.assertions(3);
        const lean = jest.fn().mockResolvedValue(true);
        const findOne = jest.fn(() => ({ lean }));
        const userModel = {
            findOne,
        };
        const userId = 'abcd';
        const request: any = { params: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ _id: userId });
        expect(response.locals.user).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws NoUserFound when user is not found', async () => {
        expect.assertions(1);
        const lean = jest.fn().mockResolvedValue(false);
        const findOne = jest.fn(() => ({ lean }));
        const userModel = {
            findOne,
        };
        const userId = 'abcd';
        const request: any = { params: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.NoUserFound, expect.any(Error)));
    });

    test('calls next with GetRetrieveUserMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getRetrieveUserMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.RetrieveUserMiddleware, expect.any(Error)));
    });
});

describe('populateUserFollowersMiddleware', () => {
    test('populates user followers', async () => {
        expect.assertions(3);
        const request: any = {};
        const followerId = 'followerId';
        const user = {
            followers: [followerId],
        };
        const response: any = { locals: { user } };
        const next = jest.fn();

        const lean = jest.fn().mockResolvedValue({ username: 'username' });
        const findById = jest.fn(() => ({ lean }));

        const userModel = {
            findById,
        };

        const middleware = getPopulateUserFollowersMiddleware(userModel as any);
        await middleware(request, response, next);

        expect(findById).toBeCalledWith(followerId);
        expect(lean).toBeCalled();
        expect(next).toBeCalled();
    });

    test('calls next with PopulateUserFollowersMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        const middleware = getPopulateUserFollowersMiddleware({} as any);
        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.PopulateUserFollowersMiddleware, expect.any(Error)));
    });
});

describe('populateUserFollowingMiddleware', () => {
    test('populates user following', async () => {
        expect.assertions(3);
        const request: any = {};
        const followingId = 'followerId';
        const user = {
            following: [followingId],
        };
        const response: any = { locals: { user } };
        const next = jest.fn();

        const lean = jest.fn().mockResolvedValue({ username: 'username' });
        const findById = jest.fn(() => ({ lean }));

        const userModel = {
            findById,
        };

        const middleware = getPopulateUserFollowingMiddleware(userModel as any);
        await middleware(request, response, next);

        expect(findById).toBeCalledWith(followingId);
        expect(lean).toBeCalled();
        expect(next).toBeCalled();
    });

    test('calls next with PopulateUserFollowingMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        const middleware = getPopulateUserFollowingMiddleware({} as any);
        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.PopulateUserFollowingMiddleware, expect.any(Error)));
    });
});

describe('populateUserAchievementMiddleware', () => {
    test('populates user achievements', async () => {
        expect.assertions(3);
        const request: any = {};
        const userAchievement: UserAchievement = {
            _id: '_id',
            achievementType: AchievementTypes.oneHundredDaySoloStreak,
        };
        const user = {
            _id: 'userId',
            achievements: [userAchievement],
        };
        const response: any = { locals: { user } };
        const next = jest.fn();

        const lean = jest.fn().mockResolvedValue(true);
        const findById = jest.fn(() => ({ lean }));

        const achievementModel = {
            findById,
        };

        const middleware = getPopulateUserAchievementsMiddleware(achievementModel as any);
        await middleware(request, response, next);

        expect(findById).toBeCalledWith(userAchievement._id);
        expect(lean).toBeCalled();
        expect(next).toBeCalled();
    });

    test('calls next with PopulateUserAchievementMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        const middleware = getPopulateUserAchievementsMiddleware({} as any);
        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.PopulateUserAchievementMiddleware, expect.any(Error)));
    });
});

describe('formatUserMiddleware', () => {
    test('populates response.locals.user with a formattedUser', () => {
        expect.assertions(3);
        const request: any = {};
        const user = getMockUser();
        const response: any = { locals: { user } };
        const next = jest.fn();

        formatUserMiddleware(request, response, next);

        expect(next).toBeCalled();
        expect(response.locals.user.isPayingMember).toEqual(true);
        expect(Object.keys(response.locals.user).sort()).toEqual(
            [
                '_id',
                'username',
                'isPayingMember',
                'userType',
                'timezone',
                'followers',
                'following',
                'totalStreakCompletes',
                'totalLiveStreaks',
                'createdAt',
                'updatedAt',
                'profileImages',
                'achievements',
            ].sort(),
        );
    });

    test('calls next with FormatUserMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        formatUserMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.FormatUserMiddleware, expect.any(Error)));
    });
});

describe('sendRetrieveUserResponseMiddleware', () => {
    test('sends user', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const user = { _id: 'abc' };
        const request: any = {};
        const response: any = { locals: { user }, status };
        const next = jest.fn();

        sendUserMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(200);
        expect(send).toBeCalledWith(user);
    });

    test('calls next with SendRetrieveUserResponseMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const error = 'error';
        const send = jest.fn(() => Promise.reject(error));
        const status = jest.fn(() => ({ send }));
        const response: any = { status };
        const next = jest.fn();

        await sendUserMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendUserMiddleware, expect.any(Error)));
    });
});

describe('getUserMiddlewares', () => {
    test('are defined in the correct order', () => {
        expect.assertions(8);

        expect(getUserMiddlewares.length).toEqual(7);
        expect(getUserMiddlewares[0]).toEqual(userParamsValidationMiddleware);
        expect(getUserMiddlewares[1]).toEqual(retrieveUserMiddleware);
        expect(getUserMiddlewares[2]).toEqual(populateUserFollowersMiddleware);
        expect(getUserMiddlewares[3]).toEqual(populateUserFollowingMiddleware);
        expect(getUserMiddlewares[4]).toEqual(populateUserAchievementsMiddleware);
        expect(getUserMiddlewares[5]).toEqual(formatUserMiddleware);
        expect(getUserMiddlewares[6]).toEqual(sendUserMiddleware);
    });
});
