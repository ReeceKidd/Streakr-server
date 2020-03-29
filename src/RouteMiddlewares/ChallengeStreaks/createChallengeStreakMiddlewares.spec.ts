/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createChallengeStreakMiddlewares,
    createChallengeStreakBodyValidationMiddleware,
    createChallengeStreakMiddleware,
    getCreateChallengeStreakMiddleware,
    sendFormattedChallengeStreakMiddleware,
    getIsUserAlreadyInChallengeMiddleware,
    addUserToChallengeMembersMiddleware,
    getAddUserToChallengeMembersMiddleware,
    isUserAlreadyInChallengeMiddleware,
    getDoesChallengeExistMiddleware,
    getDoesUserExistMiddleware,
    doesChallengeExistMiddleware,
    doesUserExistMiddleware,
    addChallengeBadgeToUserBadgesMiddleware,
    getAddChallengeBadgeToUserBadgesMiddleware,
    getJoinChallengeActivityFeedItemMiddleware,
    joinChallengeActivityFeedItemMiddleware,
    increaseNumberOfMembersInChallengeMiddleware,
    getIncreaseNumberOfMembersInChallengeMiddleware,
} from './createChallengeStreakMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe(`createChallengeStreakBodyValidationMiddleware`, () => {
    const userId = '12345678';
    const challengeId = 'abcdefgh';

    const body = {
        userId,
        challengeId,
    };

    test('valid request passes validation', () => {
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

        createChallengeStreakBodyValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends userId is missing error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, userId: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createChallengeStreakBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends challengeId is missing error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, challengeId: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createChallengeStreakBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "challengeId" fails because ["challengeId" is required]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('doesChallengeExistMiddleware', () => {
    test('calls next if challenge exists', async () => {
        expect.assertions(3);
        const lean = jest.fn(() => true);
        const findOne = jest.fn(() => ({ lean }));
        const challengeModel = { findOne };
        const challengeId = 'challengeId';
        const request: any = { body: { challengeId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDoesChallengeExistMiddleware(challengeModel as any);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ _id: challengeId });
        expect(lean).toBeCalledWith();
        expect(next).toBeCalledWith();
    });

    test('throws CreatteChallengeStreakChallengeDoesNotExist', async () => {
        expect.assertions(1);
        const challengeId = 'abcd';
        const lean = jest.fn(() => false);
        const findOne = jest.fn(() => ({ lean }));
        const challengeModel = { findOne };
        const request: any = { body: { challengeId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDoesChallengeExistMiddleware(challengeModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.CreateChallengeStreakChallengeDoesNotExist));
    });

    test('throws DoesChallengeExistMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getDoesChallengeExistMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.DoesChallengeExistMiddleware, expect.any(Error)));
    });
});

describe('doesUserExistMiddleware', () => {
    test('calls next if user exists', async () => {
        expect.assertions(4);
        const lean = jest.fn(() => true);
        const findOne = jest.fn(() => ({ lean }));
        const userModel = { findOne };
        const userId = 'userId';
        const request: any = { body: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDoesUserExistMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(response.locals.user).toBeDefined();
        expect(findOne).toBeCalledWith({ _id: userId });
        expect(lean).toBeCalledWith();
        expect(next).toBeCalledWith();
    });

    test('throws CreatteChallengeStreakUserDoesNotExist', async () => {
        expect.assertions(1);
        const userId = 'abcd';
        const lean = jest.fn(() => false);
        const findOne = jest.fn(() => ({ lean }));
        const userModel = { findOne };
        const request: any = { body: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDoesUserExistMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.CreateChallengeStreakUserDoesNotExist));
    });

    test('throws DoesUserExistMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getDoesUserExistMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateChallengeStreakDoesUserExistMiddleware, expect.any(Error)),
        );
    });
});

describe('isUserAlreadyInChallengeMiddleware', () => {
    test('calls next when user is not already in challenge', async () => {
        expect.assertions(2);
        const userId = 'userId';
        const challengeId = 'challengeId';
        const findOne = jest.fn().mockResolvedValue(false);
        const challenge = {
            findOne,
        };

        const response: any = {};
        const request: any = { body: { userId, challengeId } };
        const next = jest.fn();

        const middleware = getIsUserAlreadyInChallengeMiddleware(challenge as any);
        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ _id: challengeId, members: userId });
        expect(next).toBeCalledWith();
    });

    test('throws UserIsAlreadyInChallenge when user is already in the challenge', async () => {
        expect.assertions(2);
        const userId = 'userId';
        const challengeId = 'challengeId';
        const findOne = jest.fn().mockResolvedValue(true);
        const challenge = {
            findOne,
        };

        const response: any = {};
        const request: any = { body: { userId, challengeId } };
        const next = jest.fn();

        const middleware = getIsUserAlreadyInChallengeMiddleware(challenge as any);
        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ _id: challengeId, members: userId });
        expect(next).toBeCalledWith(new CustomError(ErrorType.UserIsAlreadyInChallenge));
    });

    test('calls next with IsUserAlreadyInChallengeMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        const middleware = getIsUserAlreadyInChallengeMiddleware({} as any);
        middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.IsUserAlreadyInChallengeMiddleware, expect.any(Error)));
    });
});

describe('addUserToChallengeMembersMiddleware', () => {
    test('adds userId to challenge members array', async () => {
        expect.assertions(4);
        const userId = 'userId';
        const challengeId = 'challengeId';
        const lean = jest.fn().mockResolvedValue(true);
        const findOneAndUpdate = jest.fn(() => ({ lean }));
        const challenge = {
            findOneAndUpdate,
        };
        const response: any = { locals: {} };
        const request: any = { body: { userId, challengeId } };
        const next = jest.fn();

        const middleware = getAddUserToChallengeMembersMiddleware(challenge as any);
        await middleware(request, response, next);

        expect(findOneAndUpdate).toBeCalledWith({ _id: challengeId }, { $push: { members: userId } }, { new: true });
        expect(lean).toBeCalled();
        expect(response.locals.challenge).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('calls next with AddUserToChallengeMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        const middleware = getAddUserToChallengeMembersMiddleware({} as any);
        middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.AddUserToChallengeMiddleware, expect.any(Error)));
    });
});

describe('increaseNumberOfMembersInChallengeMiddleware', () => {
    test('increases the challenges numberOfMembers by 1', async () => {
        expect.assertions(4);
        const challengeId = 'challengeId';
        const challenge = { members: ['member'] };
        const lean = jest.fn().mockResolvedValue(true);
        const findOneAndUpdate = jest.fn(() => ({ lean }));
        const challengeModel = {
            findOneAndUpdate,
        };
        const response: any = { locals: { challenge } };
        const request: any = { body: { challengeId } };
        const next = jest.fn();

        const middleware = getIncreaseNumberOfMembersInChallengeMiddleware(challengeModel as any);
        await middleware(request, response, next);

        expect(findOneAndUpdate).toBeCalledWith(
            { _id: challengeId },
            { $set: { numberOfMembers: challenge.members.length } },
            { new: true },
        );
        expect(lean).toBeCalled();
        expect(response.locals.challenge).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('calls next with IncreaseNumberOfMembersInChallengeMiddleware, error on middleware failure', async () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        const middleware = getIncreaseNumberOfMembersInChallengeMiddleware({} as any);
        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.IncreaseNumberOfMembersInChallengeMiddleware, expect.any(Error)),
        );
    });
});

describe(`createChallengeStreakFromRequestMiddleware`, () => {
    test('sets response.locals.savedChallengeStreak', async () => {
        expect.assertions(2);
        const challenge = {
            _id: 'challengId',
            badgeId: 'badgeId',
        };
        const userId = 'abcdefg';
        const timezone = 'Europe/London';
        const save = jest.fn().mockResolvedValue(true);

        const challengeStreak = jest.fn(() => ({ save }));

        const response: any = { locals: { timezone, challenge } };
        const request: any = { body: { userId } };
        const next = jest.fn();

        const middleware = getCreateChallengeStreakMiddleware(challengeStreak as any);

        await middleware(request, response, next);

        expect(response.locals.savedChallengeStreak).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('calls next with CreateChallengeStreakFromRequestMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getCreateChallengeStreakMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateChallengeStreakFromRequestMiddleware, expect.any(Error)),
        );
    });
});

describe('addUserToChallengeMembersMiddleware', () => {
    test('adds user to members on challenge', async () => {
        expect.assertions(4);
        const userId = 'userId';
        const challengeId = 'challengeId';
        const lean = jest.fn().mockResolvedValue(true);
        const findOneAndUpdate = jest.fn(() => ({ lean }));
        const challenge = {
            findOneAndUpdate,
        };

        const response: any = { locals: {} };
        const request: any = { body: { userId, challengeId } };
        const next = jest.fn();

        const middleware = getAddUserToChallengeMembersMiddleware(challenge as any);
        await middleware(request, response, next);

        expect(findOneAndUpdate).toBeCalledWith({ _id: challengeId }, { $push: { members: userId } }, { new: true });
        expect(lean).toBeCalled();
        expect(response.locals.challenge).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('calls next with AddUserToChallengeMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        const middleware = getIsUserAlreadyInChallengeMiddleware({} as any);
        middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.AddUserToChallengeMiddleware, expect.any(Error)));
    });
});

describe('addChallengeBadgeToUserBadgesMiddleware', () => {
    test('adds challenge badge to users badges', async () => {
        expect.assertions(2);
        const user = {
            _id: '_id',
        };
        const challenge = {
            badgeId: 'badgeId',
        };
        const findOneAndUpdate = jest.fn().mockResolvedValue(false);
        const userModel = {
            findOneAndUpdate,
        };

        const response: any = { locals: { user, challenge } };
        const request: any = {};
        const next = jest.fn();

        const middleware = getAddChallengeBadgeToUserBadgesMiddleware(userModel as any);
        await middleware(request, response, next);

        expect(findOneAndUpdate).toBeCalledWith({ _id: user._id }, { $push: { badges: challenge.badgeId } });
        expect(next).toBeCalledWith();
    });

    test('calls next with AddChallengeBadgeToUserBadgesMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        const middleware = getAddChallengeBadgeToUserBadgesMiddleware({} as any);
        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.AddUserToChallengeMiddleware, expect.any(Error)));
    });
});

describe(`sendFormattedChallengeStreakMiddleware`, () => {
    const savedChallengeStreak = {
        userId: 'abc',
        streakName: 'Daily Spanish',
        streakDescription: 'Practice spanish every day',
        startDate: new Date(),
    };

    test('responds with status 201 with challengeStreak', () => {
        expect.assertions(4);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const challengeStreakResponseLocals = {
            savedChallengeStreak,
        };
        const response: any = { locals: challengeStreakResponseLocals, status };
        const request: any = {};
        const next = jest.fn();

        sendFormattedChallengeStreakMiddleware(request, response, next);

        expect(response.locals.user).toBeUndefined();
        expect(next).toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.created);
        expect(send).toBeCalledWith(savedChallengeStreak);
    });

    test('calls next with SendFormattedChallengeStreakMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        sendFormattedChallengeStreakMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendFormattedChallengeStreakMiddleware, expect.any(Error)),
        );
    });
});

describe(`createJoinChallengeActivityFeedItemMiddleware`, () => {
    test('creates a new createJoinChallengeActivityFeedItem', async () => {
        expect.assertions(2);
        const user = { _id: '_id' };
        const challenge = { _id: '_id' };
        const savedChallengeStreak = { _id: '_id' };
        const save = jest.fn().mockResolvedValue(true);
        const activityModel = jest.fn(() => ({ save }));

        const response: any = { locals: { user, challenge, savedChallengeStreak } };
        const request: any = {};
        const next = jest.fn();

        const middleware = getJoinChallengeActivityFeedItemMiddleware(activityModel as any);

        await middleware(request, response, next);

        expect(save).toBeCalled();
        expect(next).not.toBeCalled();
    });

    test('calls next with JoinChallengeActivityFeedItemMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getJoinChallengeActivityFeedItemMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.JoinChallengeActivityFeedItemMiddleware, expect.any(Error)),
        );
    });
});

describe(`createChallengeStreakMiddlewares`, () => {
    test('that createChallengeStreak middlewares are defined in the correct order', async () => {
        expect.assertions(11);

        expect(createChallengeStreakMiddlewares.length).toEqual(10);
        expect(createChallengeStreakMiddlewares[0]).toBe(createChallengeStreakBodyValidationMiddleware);
        expect(createChallengeStreakMiddlewares[1]).toBe(doesChallengeExistMiddleware);
        expect(createChallengeStreakMiddlewares[2]).toBe(doesUserExistMiddleware);
        expect(createChallengeStreakMiddlewares[3]).toBe(isUserAlreadyInChallengeMiddleware);
        expect(createChallengeStreakMiddlewares[4]).toBe(addUserToChallengeMembersMiddleware);
        expect(createChallengeStreakMiddlewares[5]).toBe(increaseNumberOfMembersInChallengeMiddleware);
        expect(createChallengeStreakMiddlewares[6]).toBe(addChallengeBadgeToUserBadgesMiddleware);
        expect(createChallengeStreakMiddlewares[7]).toBe(createChallengeStreakMiddleware);
        expect(createChallengeStreakMiddlewares[8]).toBe(sendFormattedChallengeStreakMiddleware);
        expect(createChallengeStreakMiddlewares[9]).toBe(joinChallengeActivityFeedItemMiddleware);
    });
});
