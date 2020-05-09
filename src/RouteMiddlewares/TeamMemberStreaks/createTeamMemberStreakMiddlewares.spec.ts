/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createTeamMemberStreakMiddlewares,
    createTeamMemberStreakBodyValidationMiddleware,
    createTeamMemberStreakFromRequestMiddleware,
    getCreateTeamMemberStreakFromRequestMiddleware,
    saveTeamMemberStreakToDatabaseMiddleware,
    sendFormattedTeamMemberStreakMiddleware,
    retrieveUserMiddleware,
    getRetrieveTeamStreakMiddleware,
    getRetrieveUserMiddleware,
    retrieveTeamStreakMiddleware,
    getIncreaseUsersTotalLiveStreaksByOneMiddleware,
    increaseUsersTotalLiveStreaksByOneMiddleware,
} from './createTeamMemberStreakMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

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

    describe(`createTeamMemberStreakFromRequestMiddleware`, () => {
        test('sets response.locals.newTeamMemberStreak', async () => {
            expect.assertions(2);
            const userId = 'userId';
            const teamStreakId = '1a2b3c';
            const timezone = 'Europe/London';
            class TeamMemberStreak {
                userId: string;
                teamStreakId: string;
                timezone: string;

                constructor({ userId, teamStreakId, timezone }: any) {
                    this.userId = userId;
                    this.teamStreakId = teamStreakId;
                    this.timezone = timezone;
                }
            }
            const response: any = { locals: { timezone } };
            const request: any = { body: { userId, teamStreakId } };
            const next = jest.fn();
            const newTeamMemberStreak = new TeamMemberStreak({
                userId,
                teamStreakId,
                timezone,
            });
            const middleware = getCreateTeamMemberStreakFromRequestMiddleware(TeamMemberStreak as any);

            middleware(request, response, next);

            expect(response.locals.newTeamMemberStreak).toEqual(newTeamMemberStreak);
            expect(next).toBeCalledWith();
        });

        test('calls next with CreateTeamMemberStreakFromRequestMiddleware error on middleware failure', () => {
            expect.assertions(1);
            const timezone = 'Europe/London';
            const userId = 'userId';
            const name = 'streak name';
            const description = 'mock streak description';
            const response: any = { locals: { timezone } };
            const request: any = { body: { userId, name, description } };
            const next = jest.fn();
            const middleware = getCreateTeamMemberStreakFromRequestMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateTeamMemberStreakFromRequestMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`saveTeamMemberStreakToDatabaseMiddleware`, () => {
        const ERROR_MESSAGE = 'error';

        test('sets response.locals.savedTeamMemberStreak', async () => {
            expect.assertions(3);
            const save = jest.fn(() => {
                return Promise.resolve(true);
            });
            const mockTeamMemberStreak = {
                userId: 'userId',
                email: 'user@gmail.com',
                password: 'password',
                save,
            } as any;
            const response: any = {
                locals: { newTeamMemberStreak: mockTeamMemberStreak },
            };
            const request: any = {};
            const next = jest.fn();

            await saveTeamMemberStreakToDatabaseMiddleware(request, response, next);

            expect(save).toBeCalled();
            expect(response.locals.savedTeamMemberStreak).toBeDefined();
            expect(next).toBeCalled();
        });

        test('calls next with SaveTeamMemberStreakToDatabaseMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const save = jest.fn(() => {
                return Promise.reject(ERROR_MESSAGE);
            });
            const request: any = {};
            const response: any = { locals: { newTeamMemberStreak: { save } } };
            const next = jest.fn();

            await saveTeamMemberStreakToDatabaseMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.SaveTeamMemberStreakToDatabaseMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`sendFormattedTeamMemberStreakMiddleware`, () => {
        const ERROR_MESSAGE = 'error';
        const savedTeamMemberStreak = {
            userId: 'abc',
            streakName: 'Daily Spanish',
            streakDescription: 'Practice spanish every day',
            startDate: new Date(),
        };

        test('responds with status 201 with teamMemberStreak', () => {
            expect.assertions(4);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const teamMemberStreakResponseLocals = {
                savedTeamMemberStreak,
            };
            const response: any = { locals: teamMemberStreakResponseLocals, status };
            const request: any = {};
            const next = jest.fn();

            sendFormattedTeamMemberStreakMiddleware(request, response, next);

            expect(response.locals.user).toBeUndefined();
            expect(next).toBeCalled();
            expect(status).toBeCalledWith(ResponseCodes.created);
            expect(send).toBeCalledWith(savedTeamMemberStreak);
        });

        test('calls next with SendFormattedTeamMemberStreakMiddleware error on middleware failure', () => {
            expect.assertions(1);
            const send = jest.fn(() => {
                throw new Error(ERROR_MESSAGE);
            });
            const status = jest.fn(() => ({ send }));
            const response: any = { locals: { savedTeamMemberStreak }, status };

            const request: any = {};
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
        expect.assertions(8);

        expect(createTeamMemberStreakMiddlewares.length).toEqual(7);
        expect(createTeamMemberStreakMiddlewares[0]).toBe(createTeamMemberStreakBodyValidationMiddleware);
        expect(createTeamMemberStreakMiddlewares[1]).toBe(retrieveUserMiddleware);
        expect(createTeamMemberStreakMiddlewares[2]).toBe(retrieveTeamStreakMiddleware);
        expect(createTeamMemberStreakMiddlewares[3]).toBe(createTeamMemberStreakFromRequestMiddleware);
        expect(createTeamMemberStreakMiddlewares[4]).toBe(saveTeamMemberStreakToDatabaseMiddleware);
        expect(createTeamMemberStreakMiddlewares[5]).toBe(sendFormattedTeamMemberStreakMiddleware);
        expect(createTeamMemberStreakMiddlewares[6]).toBe(increaseUsersTotalLiveStreaksByOneMiddleware);
    });
});
