/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createTeamStreakMiddlewares,
    createTeamStreakBodyValidationMiddleware,
    sendTeamStreakMiddleware,
    TeamStreakRegistrationRequestBody,
    createTeamMemberStreaksMiddleware,
    getCreateTeamMemberStreaksMiddleware,
    createTeamStreakMiddleware,
    getCreateTeamStreakMiddleware,
    updateTeamStreakMembersArrayMiddleware,
    getUpdateTeamStreakMembersArray,
    populateTeamStreakMembersInformationMiddleware,
    retrieveCreatedTeamStreakCreatorInformationMiddleware,
    getRetrieveCreatedTeamStreakCreatorInformationMiddleware,
    getPopulateTeamStreakMembersInformationMiddleware,
    createdTeamStreakActivityFeedItemMiddleware,
    getCreateTeamStreakActivityFeedItemMiddleware,
    increaseTeamStreakMembersTotalLiveStreaksByOneMiddleware,
    getIncreaseTeamStreakMembersTotalLiveStreaksByOneMiddleware,
} from './createTeamStreakMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe(`createTeamStreakMiddlewares`, () => {
    describe(`createTeamStreakBodyValidationMiddleware`, () => {
        const creatorId = 'creatorId';
        const streakName = 'Followed our calorie level';
        const streakDescription = 'Stuck to our recommended calorie level';
        const numberOfMinutes = 30;
        const memberId = 'memberId';
        const teamMemberStreakId = 'teamMemberStreakId';
        const members = [{ memberId, teamMemberStreakId }];

        const body: TeamStreakRegistrationRequestBody = {
            creatorId,
            streakName,
            streakDescription,
            numberOfMinutes,
            members,
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

            createTeamStreakBodyValidationMiddleware(request, response, next);

            expect(next).toBeCalled();
        });

        test('sends creatorId is missing error', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: {
                    ...body,
                    creatorId: undefined,
                },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createTeamStreakBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "creatorId" fails because ["creatorId" is required]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends streakName is missing error', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: {
                    ...body,
                    streakName: undefined,
                },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createTeamStreakBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "streakName" fails because ["streakName" is required]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends members must be an array error', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: {
                    ...body,
                    members: 123,
                },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createTeamStreakBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "members" fails because ["members" must be an array]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends members must have at least one member error', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: {
                    ...body,
                    members: [],
                },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createTeamStreakBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "members" fails because ["members" must contain at least 1 items]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends members must contain an object with memberId property', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: {
                    ...body,
                    members: [{ teamMemberStreakId }],
                },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createTeamStreakBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message:
                    'child "members" fails because ["members" at position 0 fails because [child "memberId" fails because ["memberId" is required]]]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends members must contain an object with teamMemberStreakMemberId property', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: {
                    ...body,
                    members: [{ memberId, teamMemberStreakId: 123 }],
                },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createTeamStreakBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message:
                    'child "members" fails because ["members" at position 0 fails because [child "teamMemberStreakId" fails because ["teamMemberStreakId" must be a string]]]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends numberOfMinutes must be a postive number error', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: {
                    ...body,
                    numberOfMinutes: -1,
                },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createTeamStreakBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "numberOfMinutes" fails because ["numberOfMinutes" must be a positive number]',
            });
            expect(next).not.toBeCalled();
        });
    });

    describe(`createTeamStreakMiddleware`, () => {
        test('sets response.locals.newTeamStreak and calls next', async () => {
            expect.assertions(3);
            const timezone = 'Europe/London';
            const creatorId = 'creatorId';
            const streakName = 'Daily BJJ';
            const streakDescription = 'Everyday I must drill BJJ';
            const numberOfMinutes = 30;

            const save = jest.fn(() => Promise.resolve(true));
            class TeamStreakModel {
                creatorId: string;
                streakName: string;
                streakDescription: string;
                numberOfMinutes: Date;
                timezone: string;

                constructor(
                    creatorId: string,
                    streakName: string,
                    streakDescription: string,
                    numberOfMinutes: Date,
                    timezone: string,
                ) {
                    this.creatorId = creatorId;
                    this.streakName = streakName;
                    this.streakDescription = streakDescription;
                    this.numberOfMinutes = numberOfMinutes;
                    this.timezone = timezone;
                }

                save = save;
            }
            const request: any = {
                body: {
                    creatorId,
                    streakName,
                    streakDescription,
                    numberOfMinutes,
                },
            };
            const response: any = {
                locals: { timezone },
            };
            const next = jest.fn();
            const middleware = getCreateTeamStreakMiddleware(TeamStreakModel as any);

            await middleware(request, response, next);

            expect(response.locals.newTeamStreak).toBeDefined();
            expect(save).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws CreateTeamStreakMiddleware error on Middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {
                locals: {},
            };
            const next = jest.fn();
            const middleware = getCreateTeamStreakMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.CreateTeamStreakMiddleware, expect.any(Error)));
        });
    });

    describe(`createTeamMemberStreaksMiddleware`, () => {
        test('for each member create a new team member streak and return the memberId and the teamMemberStreakId', async () => {
            expect.assertions(3);
            const timezone = 'Europe/London';
            const memberId = 'memberId';
            const members = [{ memberId }];
            const _id = '_id';
            const newTeamStreak = {
                _id,
            };

            const findOne = jest.fn(() => Promise.resolve(true));
            const userModel = { findOne };

            const save = jest.fn(() => Promise.resolve(true));
            class TeamMemberStreakModel {
                userId: string;
                teamStreakId: string;
                timezone: string;

                constructor(userId: string, teamStreakId: string, timezone: string) {
                    this.userId = userId;
                    this.teamStreakId = teamStreakId;
                    this.timezone = timezone;
                }

                save = save;
            }
            const request: any = {
                body: { members },
            };
            const response: any = {
                locals: { timezone, newTeamStreak },
            };
            const next = jest.fn();
            const middleware = getCreateTeamMemberStreaksMiddleware(userModel as any, TeamMemberStreakModel as any);

            await middleware(request, response, next);

            expect(response.locals.membersWithTeamMemberStreakIds).toBeDefined();
            expect(save).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws TeamMemberDoesNotExist error when team member does not exist', async () => {
            expect.assertions(1);
            const timezone = 'Europe/London';
            const memberId = 'memberId';
            const members = [{ memberId }];
            const _id = '_id';
            const newTeamStreak = {
                _id,
            };

            const findOne = jest.fn(() => Promise.resolve(false));
            const userModel = { findOne };

            const save = jest.fn(() => Promise.resolve(true));
            class TeamMemberStreakModel {
                userId: string;
                teamStreakId: string;
                timezone: string;

                constructor(userId: string, teamStreakId: string, timezone: string) {
                    this.userId = userId;
                    this.teamStreakId = teamStreakId;
                    this.timezone = timezone;
                }

                save = save;
            }
            const request: any = {
                body: { members },
            };
            const response: any = {
                locals: { timezone, newTeamStreak },
            };
            const next = jest.fn();
            const middleware = getCreateTeamMemberStreaksMiddleware(userModel as any, TeamMemberStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.TeamMemberDoesNotExist));
        });

        test('throws CreateTeamStreakCreateMemberStreakMiddleware error on Middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {
                locals: {},
            };
            const next = jest.fn();
            const middleware = getCreateTeamMemberStreaksMiddleware({} as any, {} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateTeamStreakCreateMemberStreakMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`createTeamStreakMiddleware`, () => {
        test('sets response.locals.newTeamStreak and calls next', async () => {
            expect.assertions(3);
            const timezone = 'Europe/London';
            const creatorId = 'creatorId';
            const streakName = 'Daily BJJ';
            const streakDescription = 'Everyday I must drill BJJ';
            const numberOfMinutes = 30;

            const save = jest.fn(() => Promise.resolve(true));
            class TeamStreakModel {
                creatorId: string;
                streakName: string;
                streakDescription: string;
                numberOfMinutes: Date;
                timezone: string;

                constructor(
                    creatorId: string,
                    streakName: string,
                    streakDescription: string,
                    numberOfMinutes: Date,
                    timezone: string,
                ) {
                    this.creatorId = creatorId;
                    this.streakName = streakName;
                    this.streakDescription = streakDescription;
                    this.numberOfMinutes = numberOfMinutes;
                    this.timezone = timezone;
                }

                save = save;
            }
            const request: any = {
                body: { creatorId, streakName, streakDescription, numberOfMinutes },
            };
            const response: any = {
                locals: { timezone },
            };
            const next = jest.fn();
            const middleware = getCreateTeamStreakMiddleware(TeamStreakModel as any);

            await middleware(request, response, next);

            expect(response.locals.newTeamStreak).toBeDefined();
            expect(save).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws CreateTeamStreakMiddleware error on Middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {
                locals: {},
            };
            const next = jest.fn();
            const middleware = getCreateTeamStreakMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.CreateTeamStreakMiddleware, expect.any(Error)));
        });
    });

    describe(`updateTeamStreakMembersArrayMiddleware`, () => {
        test('updates teamStreak members array', async () => {
            expect.assertions(3);
            const membersWithTeamMemberStreakIds: string[] = [];
            const _id = '_id';
            const newTeamStreak = {
                _id,
            };
            const request: any = {};
            const response: any = {
                locals: { membersWithTeamMemberStreakIds, newTeamStreak },
            };
            const next = jest.fn();
            const lean = jest.fn().mockResolvedValue(true);
            const findByIdAndUpdate = jest.fn(() => ({ lean }));
            const TeamStreakModel = {
                findByIdAndUpdate,
            };
            const middleware = getUpdateTeamStreakMembersArray(TeamStreakModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                _id,
                {
                    members: membersWithTeamMemberStreakIds,
                },
                { new: true },
            );
            expect(lean).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws UpdateTeamStreakMembersArray error on Middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {
                locals: {},
            };
            const next = jest.fn();
            const middleware = getUpdateTeamStreakMembersArray({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.UpdateTeamStreakMembersArray, expect.any(Error)));
        });
    });

    describe('populateTeamStreakMembersInformation', () => {
        test('populates team streak members information and sets response.locals.newTeamStreak', async () => {
            expect.assertions(5);

            const user = { _id: '12345678', username: 'usernames' };
            const lean = jest.fn().mockResolvedValue(user);
            const findOne = jest.fn(() => ({ lean }));
            const userModel: any = {
                findOne,
            };
            const teamStreakModel: any = {
                findOne,
            };
            const members = [{ memberId: '12345678', teamMemberStreakId: 'ABC' }];
            const newTeamStreak = { _id: 'abc', members };
            const request: any = {};
            const response: any = { locals: { newTeamStreak } };
            const next = jest.fn();

            const middleware = getPopulateTeamStreakMembersInformationMiddleware(userModel, teamStreakModel);
            await middleware(request, response, next);

            expect(findOne).toHaveBeenCalledTimes(2);
            expect(lean).toHaveBeenCalledTimes(2);

            expect(response.locals.newTeamStreak).toBeDefined();
            const member = response.locals.newTeamStreak.members[0];
            expect(Object.keys(member)).toEqual(['_id', 'username', 'teamMemberStreak']);

            expect(next).toBeCalledWith();
        });

        test('calls next with PopulateTeamStreakMembersInformation on middleware failure', async () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();

            const middleware = getPopulateTeamStreakMembersInformationMiddleware({} as any, {} as any);
            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.RetrieveTeamStreakMembersInformation, expect.any(Error)),
            );
        });
    });

    describe('retrieveCreatedTeamStreakCreatorInformation', () => {
        test('retrieves team streak creator information and sets response.locals.newTeamStreak', async () => {
            expect.assertions(4);

            const user = { _id: '12345678', username: 'usernames' };
            const lean = jest.fn().mockResolvedValue(user);
            const findOne = jest.fn(() => ({ lean }));
            const userModel: any = {
                findOne,
            };
            const creatorId = 'creatorId';
            const newTeamStreak = { _id: 'abc', creatorId };
            const request: any = {};
            const response: any = { locals: { newTeamStreak } };
            const next = jest.fn();

            const middleware = getRetrieveCreatedTeamStreakCreatorInformationMiddleware(userModel);
            await middleware(request, response, next);

            expect(findOne).toHaveBeenCalledWith({ _id: creatorId });
            expect(lean).toHaveBeenCalled();
            expect(response.locals.newTeamStreak.creator).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('calls next with RetrieveCreatedTeamStreakCreatorInformationMiddleware on middleware failure', async () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();

            const middleware = getRetrieveCreatedTeamStreakCreatorInformationMiddleware({} as any);
            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.RetrieveCreatedTeamStreakCreatorInformationMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`increaseTeamStreakMembersTotalLiveStreaksByOneMiddleware`, () => {
        test('increases team streak creators totalLiveStreaks by one when they create a team streak', async () => {
            expect.assertions(2);
            const memberId = 'memberId';
            const newTeamStreak = {
                creatorId: 'creatorId',
                members: [{ _id: memberId }],
            };

            const userModel = {
                findByIdAndUpdate: jest.fn().mockResolvedValue(true),
            };

            const response: any = { locals: { newTeamStreak } };
            const request: any = {};
            const next = jest.fn();

            const middleware = getIncreaseTeamStreakMembersTotalLiveStreaksByOneMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(userModel.findByIdAndUpdate).toBeCalledWith(memberId, {
                $inc: { totalLiveStreaks: 1 },
            });
            expect(next).toBeCalled();
        });

        test('calls next with IncreaseTeamStreakMembersTotalLiveStreaksByOneMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getIncreaseTeamStreakMembersTotalLiveStreaksByOneMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.IncreaseTeamStreakMembersTotalLiveStreaksByOneMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`createTeamStreakActivityFeedItemMiddleware`, () => {
        test('creates a new createTeamStreakActivity', async () => {
            expect.assertions(2);
            const user = { _id: '_id' };
            const newTeamStreak = { _id: '_id' };
            const createActivityFeedItem = jest.fn().mockResolvedValue(true);

            const response: any = { locals: { user, newTeamStreak } };
            const request: any = {};
            const next = jest.fn();

            const middleware = getCreateTeamStreakActivityFeedItemMiddleware(createActivityFeedItem as any);

            await middleware(request, response, next);

            expect(createActivityFeedItem).toBeCalled();
            expect(next).toBeCalled();
        });

        test('calls next with CreateTeamStreakActivityFeedItemMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getCreateTeamStreakActivityFeedItemMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateTeamStreakActivityFeedItemMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`sendTeamStreakMiddleware`, () => {
        test('responds with status 201 with teamStreak', () => {
            expect.assertions(3);

            const newTeamStreak = {
                userId: 'abc',
                streakName: 'Daily Spanish',
                streakDescription: 'Practice spanish every day',
                startDate: new Date(),
            };

            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const response: any = { locals: { newTeamStreak }, status };
            const request: any = {};
            const next = jest.fn();

            sendTeamStreakMiddleware(request, response, next);

            expect(next).not.toBeCalled();
            expect(status).toBeCalledWith(ResponseCodes.created);
            expect(send).toBeCalledWith(newTeamStreak);
        });

        test('calls next with SendFormattedTeamStreakMiddleware error on middleware failure', () => {
            expect.assertions(1);
            const response: any = {};

            const request: any = {};
            const next = jest.fn();

            sendTeamStreakMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.SendFormattedTeamStreakMiddleware, expect.any(Error)),
            );
        });
    });

    test('are defined in the correct order', async () => {
        expect.assertions(10);

        expect(createTeamStreakMiddlewares.length).toEqual(9);
        expect(createTeamStreakMiddlewares[0]).toBe(createTeamStreakBodyValidationMiddleware);
        expect(createTeamStreakMiddlewares[1]).toBe(createTeamStreakMiddleware);
        expect(createTeamStreakMiddlewares[2]).toBe(createTeamMemberStreaksMiddleware);
        expect(createTeamStreakMiddlewares[3]).toBe(updateTeamStreakMembersArrayMiddleware);
        expect(createTeamStreakMiddlewares[4]).toBe(populateTeamStreakMembersInformationMiddleware);
        expect(createTeamStreakMiddlewares[5]).toBe(retrieveCreatedTeamStreakCreatorInformationMiddleware);
        expect(createTeamStreakMiddlewares[6]).toBe(increaseTeamStreakMembersTotalLiveStreaksByOneMiddleware);
        expect(createTeamStreakMiddlewares[7]).toBe(createdTeamStreakActivityFeedItemMiddleware);
        expect(createTeamStreakMiddlewares[8]).toBe(sendTeamStreakMiddleware);
    });
});
