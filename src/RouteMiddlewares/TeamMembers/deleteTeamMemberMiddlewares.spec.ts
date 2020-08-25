/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    deleteTeamMemberMiddlewares,
    teamMemberParamsValidationMiddleware,
    deleteTeamMemberMiddleware,
    sendTeamMemberDeletedResponseMiddleware,
    retrieveTeamMemberMiddleware,
    getDeleteTeamMemberMiddleware,
    getRetrieveTeamStreakMiddleware,
    retrieveTeamStreakMiddleware,
    checkCurrentUserIsPartOfTeamStreakMiddleware,
    getRetrieveTeamMemberStreakMiddleware,
    retrieveTeamMemberStreakMiddleware,
    archiveTeamMemberStreakMiddleware,
    getArchiveTeamMemberStreakMiddleware,
} from './deleteTeamMemberMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { getMockUser } from '../../testHelpers/getMockUser';
import { getMockTeamStreak } from '../../testHelpers/getMockTeamStreak';
import { getMockTeamMemberStreak } from '../../testHelpers/getMockTeamMemberStreak';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';

describe('teamMemberParamsValidationMiddleware', () => {
    const teamStreakId = 'teamStreakId';
    const memberId = 'memberId';
    const params = {
        teamStreakId,
        memberId,
    };

    test('sends memberId is not defined error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: {
                ...params,
                memberId: undefined,
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        teamMemberParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "memberId" fails because ["memberId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends memberId is not a string error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { ...params, memberId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        teamMemberParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "memberId" fails because ["memberId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends teamStreakId is not defined error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: {
                ...params,
                teamStreakId: undefined,
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        teamMemberParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "teamStreakId" fails because ["teamStreakId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends teamStreakId is not a string error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { ...params, teamStreakId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        teamMemberParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "teamStreakId" fails because ["teamStreakId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('retrieveTeamStreakMiddleware', () => {
    test('sets response.locals.teamStreak and calls next()', async () => {
        expect.assertions(4);
        const teamStreakId = 'abc';
        const request: any = {
            params: { teamStreakId },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const lean = jest.fn().mockResolvedValue(true);
        const findById = jest.fn(() => ({ lean }));
        const TeamStreakModel = { findById };
        const middleware = getRetrieveTeamStreakMiddleware(TeamStreakModel as any);

        await middleware(request, response, next);

        expect(findById).toBeCalledWith(teamStreakId);
        expect(lean).toBeCalled();
        expect(response.locals.teamStreak).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws NoTeamStreakFound error when team streak does not exist', async () => {
        expect.assertions(1);
        const teamStreakId = 'abc';
        const request: any = {
            params: { teamStreakId },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const lean = jest.fn().mockResolvedValue(false);
        const findById = jest.fn(() => ({ lean }));
        const TeamStreakModel = { findById };
        const middleware = getRetrieveTeamStreakMiddleware(TeamStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.NoTeamStreakFound));
    });

    test('throws DeleteTeamMemberRetrieveTeamStreakMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getRetrieveTeamStreakMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.DeleteTeamMemberRetrieveTeamStreakMiddleware, expect.any(Error)),
        );
    });
});

describe('checkCurrentUserIsPartOfTeamStreakMiddleware', () => {
    test('that if user is a member of the team streak it calls next()', async () => {
        expect.assertions(1);
        const userId = 'userId';
        const user = getMockUser({ _id: userId });
        const teamStreak = getMockTeamStreak({ creatorId: userId });
        const request: any = {};
        const response: any = { locals: { user, teamStreak } };
        const next = jest.fn();

        checkCurrentUserIsPartOfTeamStreakMiddleware(request, response, next);

        expect(next).toBeCalledWith();
    });

    test('throws CannotDeleteTeamMemberUserIsNotApartOfTeamStreak error when team streak does not exist', async () => {
        expect.assertions(1);
        const userId = 'userId';
        const user = getMockUser({ _id: userId });
        const teamStreak = getMockTeamStreak({ creatorId: 'randomId' });
        const request: any = {};
        const response: any = { locals: { user, teamStreak } };
        const next = jest.fn();

        checkCurrentUserIsPartOfTeamStreakMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.CannotDeleteTeamMemberUserIsNotApartOfTeamStreak));
    });

    test('throws CheckCurrentUserIsPartOfTeamStreakMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getRetrieveTeamStreakMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CheckCurrentUserIsPartOfTeamStreakMiddleware, expect.any(Error)),
        );
    });
});

describe('retrieveTeamMemberStreakMiddleware', () => {
    test('sets response.locals.teamMemberStreak and calls next()', async () => {
        expect.assertions(3);
        const teamStreakId = 'abc';
        const request: any = {
            params: { teamStreakId },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const findOne = jest.fn().mockResolvedValue(true);
        const teamMemberStreakModel = { findOne };
        const middleware = getRetrieveTeamMemberStreakMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ teamStreakId });
        expect(response.locals.teamMemberStreak).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws NoTeamMemberStreakFound error when team member streak does not exist', async () => {
        expect.assertions(1);
        const teamStreakId = 'abc';
        const request: any = {
            params: { teamStreakId },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const findOne = jest.fn().mockResolvedValue(false);
        const teamMemberStreakModel = { findOne };
        const middleware = getRetrieveTeamMemberStreakMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.NoTeamMemberStreakFound));
    });

    test('throws DeleteTeamMemberRetrieveTeamMemberStreakMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getRetrieveTeamMemberStreakMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.DeleteTeamMemberRetrieveTeamMemberStreakMiddleware, expect.any(Error)),
        );
    });
});

describe('retrieveTeamMemberMiddleware', () => {
    test('sets response.locals.member and calls next()', async () => {
        expect.assertions(2);
        const memberId = 'abc';
        const members = [{ memberId }];
        const teamStreak = {
            members,
        };

        const request: any = {
            params: { memberId },
        };
        const response: any = { locals: { teamStreak } };
        const next = jest.fn();

        await retrieveTeamMemberMiddleware(request, response, next);

        expect(response.locals.member).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('calls next with RetrieveTeamMemberMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getRetrieveTeamStreakMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.DeleteTeamMemberRetrieveTeamStreakMiddleware, expect.any(Error)),
        );
    });
});

describe('deleteTeamMemberMiddleware', () => {
    test('sets response.locals.deletedTeamMember', async () => {
        expect.assertions(3);
        const memberId = 'abc123';
        const teamStreakId = '12345';
        const members = [{ memberId }];
        const teamStreak = {
            members,
        };

        const request: any = { params: { memberId, teamStreakId } };
        const response: any = { locals: { teamStreak } };
        const next = jest.fn();
        const lean = jest.fn().mockResolvedValue(true);
        const findByIdAndUpdate = jest.fn(() => ({ lean }));
        const TeamStreakModel = {
            findByIdAndUpdate,
        };
        const middleware = getDeleteTeamMemberMiddleware(TeamStreakModel as any);

        await middleware(request, response, next);

        expect(findByIdAndUpdate).toBeCalledWith(teamStreakId, { members: [] }, { new: true });
        expect(lean).toBeCalled();
        expect(next).toBeCalledWith();
    });

    test('calls next with DeleteTeamMemberMiddleware error on failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteTeamMemberMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.DeleteTeamMemberMiddleware, expect.any(Error)));
    });
});

describe('archiveTeamMemberStreakMiddleware', () => {
    test('sets team member streak status to archived.', async () => {
        expect.assertions(2);

        const user = getMockUser({ _id: 'userId' });
        const teamStreak = getMockTeamStreak({ creatorId: user._id });
        const teamMemberStreak = getMockTeamMemberStreak({ teamStreak, user });
        const request: any = {};
        const response: any = { locals: { teamMemberStreak } };
        const next = jest.fn();
        const findByIdAndUpdate = jest.fn().mockResolvedValue(true);
        const teamMemberStreakModel = {
            findByIdAndUpdate,
        };
        const middleware = getArchiveTeamMemberStreakMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(findByIdAndUpdate).toBeCalledWith(teamMemberStreak._id, {
            $set: { status: StreakStatus.archived, active: false },
        });
        expect(next).toBeCalledWith();
    });

    test('calls next with ArchiveTeamMemberStreakMiddleware error on failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getArchiveTeamMemberStreakMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.ArchiveTeamMemberStreakMiddleware, expect.any(Error)));
    });
});

describe('sendTeamMemberDeletedResponseMiddleware', () => {
    test('responds with successful deletion', () => {
        expect.assertions(2);
        const successfulDeletionResponseCode = 204;
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const response: any = { status };
        const next = jest.fn();

        sendTeamMemberDeletedResponseMiddleware(request, response, next);

        expect(status).toBeCalledWith(successfulDeletionResponseCode);
        expect(next).not.toBeCalled();
    });

    test('that on error next is called with error', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        sendTeamMemberDeletedResponseMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendTeamMemberDeletedResponseMiddleware, expect.any(Error)),
        );
    });
});

describe('deleteTeamMemberMiddlewares', () => {
    test('are defined in the correct order', () => {
        expect.assertions(9);

        expect(deleteTeamMemberMiddlewares.length).toEqual(8);
        expect(deleteTeamMemberMiddlewares[0]).toEqual(teamMemberParamsValidationMiddleware);
        expect(deleteTeamMemberMiddlewares[1]).toEqual(retrieveTeamStreakMiddleware);
        expect(deleteTeamMemberMiddlewares[2]).toEqual(checkCurrentUserIsPartOfTeamStreakMiddleware);
        expect(deleteTeamMemberMiddlewares[3]).toEqual(retrieveTeamMemberStreakMiddleware);
        expect(deleteTeamMemberMiddlewares[4]).toEqual(retrieveTeamMemberMiddleware);
        expect(deleteTeamMemberMiddlewares[5]).toEqual(deleteTeamMemberMiddleware);
        expect(deleteTeamMemberMiddlewares[6]).toEqual(archiveTeamMemberStreakMiddleware);
        expect(deleteTeamMemberMiddlewares[7]).toEqual(sendTeamMemberDeletedResponseMiddleware);
    });
});
