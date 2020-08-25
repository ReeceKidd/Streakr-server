/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createTeamMemberStreakMiddlewares,
    createTeamMemberStreakBodyValidationMiddleware,
    getCreateTeamMemberStreakMiddleware,
    sendFormattedTeamMemberStreakMiddleware,
    retrieveUserMiddleware,
    getRetrieveTeamStreakMiddleware,
    getRetrieveUserMiddleware,
    retrieveTeamStreakMiddleware,
    getIncreaseUsersTotalLiveStreaksByOneMiddleware,
    increaseUsersTotalLiveStreaksByOneMiddleware,
    createTeamMemberStreakMiddleware,
} from './createTeamMemberStreakMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { getMockUser } from '../../testHelpers/getMockUser';
import { getMockTeamStreak } from '../../testHelpers/getMockTeamStreak';
import { getMockTeamMemberStreak } from '../../testHelpers/getMockTeamMemberStreak';

describe(`createTeamMemberStreakMiddlewares`, () => {
    describe(`createTeamMemberStreakBodyValidationMiddleware`, () => {
        const userId = '12345678';
        const teamStreakId = 'teamStreakId';

        const body = {
            userId,
            teamStreakId,
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

            createTeamMemberStreakBodyValidationMiddleware(request, response, next);

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

            createTeamMemberStreakBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "userId" fails because ["userId" is required]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends teamStreakId is missing error', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { ...body, teamStreakId: undefined },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createTeamMemberStreakBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "teamStreakId" fails because ["teamStreakId" is required]',
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
            const userId = 'userId';
            const request: any = { body: { userId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getRetrieveUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(response.locals.user).toBeDefined();
            expect(findOne).toBeCalledWith({ _id: userId });
            expect(lean).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws CreateTeamMemberStreakUserDoesNotExist when user does not exist', async () => {
            expect.assertions(1);
            const userId = 'abcd';
            const lean = jest.fn(() => false);
            const findOne = jest.fn(() => ({ lean }));
            const userModel = { findOne };
            const request: any = { body: { userId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getRetrieveUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.CreateTeamMemberStreakUserDoesNotExist));
        });

        test('throws CreateTeamMemberStreakRetrieveUserMiddleware error on middleware failure', async () => {
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

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateTeamMemberStreakRetrieveUserMiddleware, expect.any(Error)),
            );
        });
    });

    describe('retrieveTeamStreakMiddleware', () => {
        test('sets response.locals.teamStreak and calls next()', async () => {
            expect.assertions(3);
            const teamStreakId = 'abc';
            const request: any = {
                body: { teamStreakId },
            };
            const response: any = { locals: {} };
            const next = jest.fn();
            const findOne = jest.fn(() => Promise.resolve(true));
            const teamStreakModel = { findOne };
            const middleware = getRetrieveTeamStreakMiddleware(teamStreakModel as any);

            await middleware(request, response, next);

            expect(findOne).toBeCalledWith({ _id: teamStreakId });
            expect(response.locals.teamStreak).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws CreateTeamMemberStreakTeamStreakDoesNotExist error when solo streak does not exist', async () => {
            expect.assertions(1);
            const teamStreakId = 'abc';
            const request: any = {
                body: { teamStreakId },
            };
            const response: any = { locals: {} };
            const next = jest.fn();
            const findOne = jest.fn(() => Promise.resolve(false));
            const teamStreakModel = { findOne };
            const middleware = getRetrieveTeamStreakMiddleware(teamStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.CreateTeamMemberStreakTeamStreakDoesNotExist));
        });

        test('throws CreateTeamMemberStreakRetrieveTeamStreakMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = { locals: {} };
            const next = jest.fn();
            const findOne = jest.fn(() => Promise.resolve(true));
            const teamStreakModel = { findOne };
            const middleware = getRetrieveTeamStreakMiddleware(teamStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateTeamMemberStreakRetrieveTeamStreakMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`createTeamMemberStreakMiddleware`, () => {
        test('sets response.locals.teamMemberStreak', async () => {
            expect.assertions(2);
            const user = getMockUser({ _id: 'userId' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamMemberStreak = getMockTeamMemberStreak({ teamStreak, user });
            const timezone = 'Europe/London';

            const createTeamMemberStreakFunction = jest.fn().mockResolvedValue(teamMemberStreak);

            const response: any = { locals: { timezone, teamStreak, user } };
            const request: any = { body: { userId: user._id } };
            const next = jest.fn();

            const middleware = getCreateTeamMemberStreakMiddleware(createTeamMemberStreakFunction as any);

            await middleware(request, response, next);

            expect(createTeamMemberStreakFunction).toBeCalledWith({
                userId: user._id,
                userProfileImage: user.profileImages.originalImageUrl,
                username: user.username,
                timezone,
                streakName: teamStreak.streakName,
                teamStreakId: teamStreak._id,
            });
            expect(next).toBeCalledWith();
        });

        test('calls next with CreateTeamMemberStreakMiddleware error on middleware failure', async () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getCreateTeamMemberStreakMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.CreateTeamMemberStreakMiddleware, expect.any(Error)));
        });
    });

    describe(`sendFormattedTeamMemberStreakMiddleware`, () => {
        test('responds with status 201 with teamMemberStreak', () => {
            expect.assertions(4);

            const user = getMockUser({ _id: 'userId' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamMemberStreak = getMockTeamMemberStreak({ teamStreak, user });
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const teamMemberStreakResponseLocals = {
                teamMemberStreak,
            };
            const response: any = { locals: teamMemberStreakResponseLocals, status };
            const request: any = {};
            const next = jest.fn();

            sendFormattedTeamMemberStreakMiddleware(request, response, next);

            expect(response.locals.user).toBeUndefined();
            expect(next).toBeCalled();
            expect(status).toBeCalledWith(ResponseCodes.created);
            expect(send).toBeCalledWith(teamMemberStreak);
        });

        test('calls next with SendFormattedTeamMemberStreakMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            sendFormattedTeamMemberStreakMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.SendFormattedTeamMemberStreakMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`increaseUsersTotalLiveStreaksByOneMiddleware`, () => {
        test('increases users totalLiveStreaks by one when they create a solo streak', async () => {
            expect.assertions(2);
            const user = { _id: '_id' };

            const userModel = {
                findByIdAndUpdate: jest.fn().mockResolvedValue(true),
            };

            const response: any = {};
            const request: any = { body: { userId: user._id } };
            const next = jest.fn();

            const middleware = getIncreaseUsersTotalLiveStreaksByOneMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(userModel.findByIdAndUpdate).toBeCalledWith(user._id, { $inc: { totalLiveStreaks: 1 } });
            expect(next).not.toBeCalled();
        });

        test('calls next with CreateSoloStreakIncreaseUsersTotalLiveStreaksByOneMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getIncreaseUsersTotalLiveStreaksByOneMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.CreateTeamMemberStreakIncreaseUsersTotalLiveStreaksByOneMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    test('that createTeamMemberStreak middlewares are defined in the correct order', async () => {
        expect.assertions(7);

        expect(createTeamMemberStreakMiddlewares.length).toEqual(6);
        expect(createTeamMemberStreakMiddlewares[0]).toBe(createTeamMemberStreakBodyValidationMiddleware);
        expect(createTeamMemberStreakMiddlewares[1]).toBe(retrieveUserMiddleware);
        expect(createTeamMemberStreakMiddlewares[2]).toBe(retrieveTeamStreakMiddleware);
        expect(createTeamMemberStreakMiddlewares[3]).toBe(createTeamMemberStreakMiddleware);
        expect(createTeamMemberStreakMiddlewares[4]).toBe(sendFormattedTeamMemberStreakMiddleware);
        expect(createTeamMemberStreakMiddlewares[5]).toBe(increaseUsersTotalLiveStreaksByOneMiddleware);
    });
});
