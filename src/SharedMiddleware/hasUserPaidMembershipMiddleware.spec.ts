/* eslint-disable @typescript-eslint/no-explicit-any */
import { hasUserPaidMembershipMiddleware } from './hasUserPaidMembershipMiddleware';
import { CustomError } from '../../src/customError';
import { ErrorType } from '../../src/customError';

describe('hasUserPaidMembershipMiddleware', () => {
    test('calls next is user has paid for their membership.', () => {
        expect.assertions(1);
        const user = {
            membershipInformation: {
                isPayingMember: true,
            },
        };
        const request: any = {};
        const response: any = {
            locals: { user },
        };
        const next = jest.fn();

        hasUserPaidMembershipMiddleware(request, response, next);

        expect(next).toBeCalledWith();
    });

    test('throws UserHasNotPaidMembership error when user is not a paying member', () => {
        expect.assertions(1);
        const user = {
            membershipInformation: {
                isPayingMember: false,
            },
        };
        const request: any = {};
        const response: any = {
            locals: { user },
        };
        const next = jest.fn();

        hasUserPaidMembershipMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.UserHasNotPaidMembership));
    });

    test('throws HasUserPaidMembershipMiddleware when middleware fails', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        hasUserPaidMembershipMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.HasUserPaidMembershipMiddleware, expect.any(Error)));
    });
});
