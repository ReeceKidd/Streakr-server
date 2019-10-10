/* eslint-disable */
import { CustomError, ErrorType } from './customError';

describe('customError', () => {
    test(`creates correct error when type is set to InvalidTimeZone`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.InvalidTimezone);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-01`);
        expect(message).toBe('Timezone is invalid.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to UserDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UserDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-02`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to PasswordDoesNotMatchHash`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PasswordDoesNotMatchHash);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-03`);
        expect(message).toBe('Password does not match hash.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to SoloStreakDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SoloStreakDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-04`);
        expect(message).toBe('Solo streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to NoSoloStreakToDeleteFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NoSoloStreakToDeleteFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-06`);
        expect(message).toBe('Solo streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to GetSoloStreakNoSoloStreakFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetSoloStreakNoSoloStreakFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-07`);
        expect(message).toBe('Solo streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to UpdatedSoloStreakNotFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UpdatedSoloStreakNotFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-08`);
        expect(message).toBe('Solo streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to UserEmailAlreadyExists`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UserEmailAlreadyExists);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-09`);
        expect(message).toBe('User email already exists.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to UsernameAlreadyExists`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UsernameAlreadyExists);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-10`);
        expect(message).toBe('Username already exists.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to StripeSubscriptionUserDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateStripeSubscriptionUserDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-11`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CustomerIsAlreadySubscribed`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CustomerIsAlreadySubscribed);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-12`);
        expect(message).toBe('User is already subscribed.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CancelStripeSubscriptionUserDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CancelStripeSubscriptionUserDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-13`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CustomerIsNotSubscribed`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CustomerIsNotSubscribed);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-14`);
        expect(message).toBe('Customer is not subscribed.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to NoUserToDeleteFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NoUserToDeleteFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-15`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to NoCompleteSoloStreakTaskToDeleteFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NoCompleteSoloStreakTaskToDeleteFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-16`);
        expect(message).toBe('Complete task does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to NoUserFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NoUserFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-17`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to AddFriendUserDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.AddFriendUserDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-18`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to FriendDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FriendDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-19`);
        expect(message).toBe('Friend does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to IsAlreadyAFriend`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.IsAlreadyAFriend);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-20`);
        expect(message).toBe('User is already a friend.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to DeleteUserNoUserFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteUserNoUserFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-21`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to DeleteUserFriendDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteUserFriendDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-22`);
        expect(message).toBe('Friend does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to GetFriendsUserDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetFriendsUserDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-23`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to NoTeamStreakToDeleteFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NoTeamStreakToDeleteFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-24`);
        expect(message).toBe('Team streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to GetTeamStreakNoTeamStreakFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetTeamStreakNoTeamStreakFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-25`);
        expect(message).toBe('Team streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to GetStreakTrackingEventNoStreakTrackingEventFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetStreakTrackingEventNoStreakTrackingEventFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-26`);
        expect(message).toBe('Streak tracking event does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to NoStreakTrackingEventToDeleteFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NoStreakTrackingEventToDeleteFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-27`);
        expect(message).toBe('Streak tracking event does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to NoAgendaJobToDeleteFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NoAgendaJobToDeleteFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-28`);
        expect(message).toBe('Agenda job does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to NoFeedbackToDeleteFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NoFeedbackToDeleteFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-29`);
        expect(message).toBe('Feedback does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CreateGroupMemberStreakUserDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateGroupMemberStreakUserDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-30`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CreateGroupMemberStreakTeamStreakDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateGroupMemberStreakTeamStreakDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-31`);
        expect(message).toBe('Team streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to NoGroupMemberStreakToDeleteFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NoGroupMemberStreakToDeleteFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-32`);
        expect(message).toBe('Group member streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to GroupMemberStreakDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GroupMemberStreakDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-33`);
        expect(message).toBe('Group member streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to GetGroupMemberStreakNoGroupMemberStreakFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetGroupMemberStreakNoGroupMemberStreakFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-34`);
        expect(message).toBe('Group member streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to TeamStreakDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.TeamStreakDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-35`);
        expect(message).toBe('Team streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to NoCompleteGroupMemberStreakTaskToDeleteFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NoCompleteGroupMemberStreakTaskToDeleteFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-36`);
        expect(message).toBe('Group member streak task does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to GroupMemberDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GroupMemberDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-37`);
        expect(message).toBe('Group member does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to UpdatedTeamStreakNotFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UpdatedTeamStreakNotFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-38`);
        expect(message).toBe('Team streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CreateGroupMemberFriendDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateGroupMemberFriendDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-39`);
        expect(message).toBe('Friend does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CreateGroupMemberTeamStreakDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateGroupMemberTeamStreakDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-40`);
        expect(message).toBe('Team streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to NoTeamStreakFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NoTeamStreakFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-41`);
        expect(message).toBe('Team streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to NoGroupMemberFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NoGroupMemberFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-42`);
        expect(message).toBe('Team streak member does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to UpdatedUserNotFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UpdatedUserNotFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-43`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to RequesterDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RequesterDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-44`);
        expect(message).toBe('Requester does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to RequesteeDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RequesteeDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-45`);
        expect(message).toBe('Requestee does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to RequesteeIsAlreadyAFriend`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RequesteeIsAlreadyAFriend);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-46`);
        expect(message).toBe('Requestee is already a friend.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to NoFriendRequestToDeleteFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NoFriendRequestToDeleteFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-47`);
        expect(message).toBe('No friend request to delete found.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to FriendRequestDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FriendRequestDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-48`);
        expect(message).toBe('Friend request must exist to add friend.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to UpdatedFriendRequestNotFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UpdatedFriendRequestNotFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-49`);
        expect(message).toBe('Friend request does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to AddFriendToUsersFriendListNotFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.AddFriendToUsersFriendListNotFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-50`);
        expect(message).toBe('Friend does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to RetreiveFormattedRequesteeDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveFormattedRequesteeDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-51`);
        expect(message).toBe('Requestee does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to RetreiveFormattedRequesterDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveFormattedRequesterDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-52`);
        expect(message).toBe('Requester does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CreateIncompleteSoloStreakTaskSoloStreakDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteSoloStreakTaskSoloStreakDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-53`);
        expect(message).toBe('Solo streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CreateIncompleteSoloStreakTaskUserDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteSoloStreakTaskUserDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-54`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to NoIncompleteSoloStreakTaskToDeleteFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NoIncompleteSoloStreakTaskToDeleteFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-55`);
        expect(message).toBe('Complete solo streak task does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CreateIncompleteGroupMemberStreakTaskGroupMemberStreakDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.CreateIncompleteGroupMemberStreakTaskGroupMemberStreakDoesNotExist,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-56`);
        expect(message).toBe('Group member streak task does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to GroupMemberStreakHasNotBeenCompletedToday`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GroupMemberStreakHasNotBeenCompletedToday);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-57`);
        expect(message).toBe('Group member streak task does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CreateIncompleteGroupMemberStreakTaskUserDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteGroupMemberStreakTaskUserDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-58`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to NoIncompleteGroupMemberStreakTaskToDeleteFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NoIncompleteGroupMemberStreakTaskToDeleteFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-59`);
        expect(message).toBe('Group member streak task does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to UpdatedGroupMemberStreakNotFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UpdatedGroupMemberStreakNotFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-60`);
        expect(message).toBe('Group member streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to SoloStreakHasBeenCompletedToday`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SoloStreakHasBeenCompletedToday);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`422-01`);
        expect(message).toBe('Solo streak task already completed today.');
        expect(httpStatusCode).toBe(422);
    });

    test(`creates correct error when type is set to SoloStreakHasNotBeenCompletedToday`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SoloStreakHasNotBeenCompletedToday);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`422-02`);
        expect(message).toBe('Solo streak has not been completed today.');
        expect(httpStatusCode).toBe(422);
    });

    test(`creates correct error when type is set to TaskAlreadyCompletedToday`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GroupMemberStreakTaskHasBeenCompletedToday);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`422-03`);
        expect(message).toBe('Group member streak task already completed today.');
        expect(httpStatusCode).toBe(422);
    });

    test(`creates correct error when type is not defined`, () => {
        expect.assertions(3);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const customError = new CustomError('Unknown' as any);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-01`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to InternalServerError`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.InternalServerError);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-01`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetreiveUserWithEmailMiddlewareError`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveUserWithEmailMiddlewareError);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-02`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CompareRequestPasswordToUserHashedPasswordMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CompareRequestPasswordToUserHashedPasswordMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-03`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SetMinimumUserDataMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SetMinimumUserDataMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-04`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SetJsonWebTokenExpiryInfoMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SetJsonWebTokenExpiryInfoMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-05`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SetJsonWebTokenMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SetJsonWebTokenMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-06`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to LoginSuccessfulMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.LoginSuccessfulMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-07`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SoloStreakExistsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SoloStreakExistsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-08`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetreiveTimezoneHeaderMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveTimezoneHeaderMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-09`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to ValidateTimezoneMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ValidateTimezoneMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-10`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetreiveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-11`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SetTaskCompleteTimeMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SetTaskCompleteTimeMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-12`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SetStreakStartDateMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SetStreakStartDateMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-13`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to HasTaskAlreadyBeenCompletedTodayMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.HasTaskAlreadyBeenCompletedTodayMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-14`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteSoloStreakTaskDefinitionMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteSoloStreakTaskDefinitionMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-15`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SaveTaskCompleteMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SaveTaskCompleteMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-16`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to StreakMaintainedMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.StreakMaintainedMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-17`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendTaskCompleteResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendTaskCompleteResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-18`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SetDayTaskWasCompletedMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SetDayTaskWasCompletedMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-19`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DefineCurrentTimeMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DefineCurrentTimeMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-20`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DefineStartDayMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DefineStartDayMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-21`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DefineEndDayMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DefineEndOfDayMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-22`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateSoloStreakFromRequestMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateSoloStreakFromRequestMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-23`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SaveSoloStreakToDatabase`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SaveSoloStreakToDatabaseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-24`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendFormattedSoloStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendFormattedSoloStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-25`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteSoloStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteSoloStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-26`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendSoloStreakDeletedResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendSoloStreakDeletedResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-27`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetreiveSoloStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveSoloStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-28`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendSoloStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendSoloStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-29`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FindSoloStreaksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FindSoloStreaksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-30`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendSoloStreaksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendSoloStreaksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-31`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PatchSoloStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PatchSoloStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-32`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendUpdatedSoloStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendUpdatedSoloStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-33`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SetSearchQueryToLowercaseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SetSearchQueryToLowercaseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-34`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetreiveUsersByUsernameRegexSearchMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveUsersMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-35`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FormatUsersMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FormatUsersMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-36`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendUsersMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendUsersMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-37`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DoesUserEmailExistMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DoesUserEmailExistMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-38`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SetUsernmaeToLowercaseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SetUsernameToLowercaseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-39`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DoesUsernameAlreadyExistMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DoesUsernameAlreadyExistMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-40`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to HashPasswordMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.HashPasswordMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-41`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SaveUserToDatabaseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SaveUserToDatabaseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-42`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendFormattedUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendFormattedUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-43`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to IsUserAnExistingStripeCustomerMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.IsUserAnExistingStripeCustomerMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-44`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateStripeCustomerMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateStripeCustomerMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-45`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateStripeSubscriptionMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateStripeSubscriptionMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-46`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to HandleInitialPaymentOutcomeMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.HandleInitialPaymentOutcomeMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-47`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendSuccessfulSubscriptionMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendSuccessfulSubscriptionMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-48`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to IncompletePayment`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.IncompletePayment);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-49`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to UnknownPaymentStatus`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UnknownPaymentStatus);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-50`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to AddStripeSubscriptionToUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.AddStripeSubscriptionToUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-51`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DoesUserHaveStripeSubscriptionMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DoesUserHaveStripeSubscriptionMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-52`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CancelStripeSubscriptionMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CancelStripeSubscriptionMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-53`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RemoveSubscriptionFromUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RemoveSubscriptionFromUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-54`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendSuccessfullyRemovedSubscriptionMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendSuccessfullyRemovedSubscriptionMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-55`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SetUserTypeToPremiumMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SetUserTypeToPremiumMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-56`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SetUserTypeToBasicMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SetUserTypeToBasicMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-57`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-58`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendUserDeletedResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendUserDeletedResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-59`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GetCompleteSoloStreakTasksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetCompleteSoloStreakTasksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-60`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendCompleteSoloStreakTasksResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendCompleteSoloStreakTasksResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-61`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteCompleteSoloStreakTaskMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteCompleteSoloStreakTaskMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-62`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendCompleteSoloStreakTaskDeletedResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendCompleteSoloStreakTaskDeletedResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-63`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GetRetreiveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetRetreiveUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-64`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendRetreiveUserResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendRetreiveUserResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-65`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetreiveIncompleteSoloStreaksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveIncompleteSoloStreaksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-66`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetreiveFriendsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveFriendsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-67`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendFormattedFriendsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendFormattedFriendsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-68`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to AddFriendRetreiveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.AddFriendRetreiveUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-69`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DoesFriendExistMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DoesFriendExistMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-70`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to AddFriendToUsersFriendListMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.AddFriendToUsersFriendListMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-71`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendUserWithNewFriendMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendUserWithNewFriendMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-72`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to IsAlreadyAFriendMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.IsAlreadyAFriendMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-73`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteUserGetRetreivedUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteUserRetreiveUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-74`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteFriendDoesFriendExistMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteFriendDoesFriendExistMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-75`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteFriendMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteFriendMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-76`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GetFriendsRetreiveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetFriendsRetreiveUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-77`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FormatFriendsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FormatFriendsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-78`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to TeamStreakDefineCurrentTimeMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.TeamStreakDefineCurrentTimeMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-79`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to TeamStreakDefineStartDayMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.TeamStreakDefineStartDayMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-80`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to TeamStreakDefineEndOfDayMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.TeamStreakDefineEndOfDayMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-81`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateTeamStreakFromRequestMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-82`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SaveTeamStreakToDatabaseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SaveTeamStreakToDatabaseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-83`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendFormattedTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendFormattedTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-84`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FindTeamStreaksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FindTeamStreaksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-85`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendTeamStreaksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendTeamStreaksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-86`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetreiveTeamStreaksMembersInformation`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveTeamStreaksMembersInformation);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-87`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-88`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendTeamStreakDeletedResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendTeamStreakDeletedResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-89`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetreiveTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-90`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-91`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetreiveTeamStreakMembersInformation`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveTeamStreakMembersInformation);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-92`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateStreakTrackingEventFromRequestMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateStreakTrackingEventFromRequestMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-93`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SaveStreakTrackingEventToDatabaseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SaveStreakTrackingEventToDatabaseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-94`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendFormattedStreakTrackingEventMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendFormattedStreakTrackingEventMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-95`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GetStreakTrackingEventsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetStreakTrackingEventsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-96`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendStreakTrackingEventsResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendStreakTrackingEventsResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-97`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetreiveStreakTrackingEventMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveStreakTrackingEventMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-98`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendStreakTrackingEventMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendStreakTrackingEventMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-99`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteStreakTrackingEventMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteStreakTrackingEventMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-100`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendStreakTrackingEventDeletedResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendStreakTrackingEventDeletedResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-101`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteAgendaJobMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteAgendaJobMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-102`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendAgendaJobDeletedResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendAgendaJobDeletedResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-103`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateFeedbackFromRequestMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateFeedbackFromRequestMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-104`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SaveFeedbackToDatabaseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SaveFeedbackToDatabaseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-105`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendFormattedFeedbackMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendFormattedFeedbackMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-106`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteFeedbackMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteFeedbackMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-107`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendFeedbackDeletedResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendFeedbackDeletedResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-108`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetreiveTeamStreakCreatorInformationMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveTeamStreakCreatorInformationMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-109`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateGroupMemberStreakFromRequestMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateGroupMemberStreakFromRequestMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-110`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SaveGroupMemberStreakToDatabaseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SaveGroupMemberStreakToDatabaseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-111`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendFormattedGroupMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendFormattedGroupMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-112`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateGroupMemberStreakRetreiveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateGroupMemberStreakRetreiveUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-113`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateGroupMemberStreakRetreiveTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateGroupMemberStreakRetreiveTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-114`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteGroupMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteGroupMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-115`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendGroupMemberStreakDeletedResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendGroupMemberStreakDeletedResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-116`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GroupMemberStreakExistsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GroupMemberStreakExistsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-117`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteGroupMemberStreakTaskRetreiveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteGroupMemberStreakTaskRetreiveUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-118`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SetGroupMemberStreakTaskCompleteTimeMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SetGroupMemberStreakTaskCompleteTimeMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-119`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SetGroupMemberStreakStartDateMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SetGroupMemberStreakStartDateMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-120`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SetDayGroupMemberStreakTaskWasCompletedMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SetDayGroupMemberStreakTaskWasCompletedMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-121`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to HasGroupMemberStreakTaskAlreadyBeenCompletedTodayMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.HasGroupMemberStreakTaskAlreadyBeenCompletedTodayMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-122`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SaveGroupMemberStreakTaskCompleteMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SaveGroupMemberStreakTaskCompleteMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-123`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GroupMemberStreakMaintainedMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GroupMemberStreakMaintainedMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-124`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendCompleteGroupMemberStreakTaskResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendCompleteGroupMemberStreakTaskResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-125`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteGroupMemberStreakTaskDefinitionMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteGroupMemberStreakTaskDefinitionMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-126`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetreiveGroupMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveGroupMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-127`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendGroupMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendGroupMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-128`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to TeamStreakExistsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.TeamStreakExistsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-129`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteGroupMemberStreakTaskMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteGroupMemberStreakTaskMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-130`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteCompleteGroupMemberStreakTaskMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteCompleteGroupMemberStreakTaskMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-131`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendCompleteGroupMemberStreakTaskDeletedResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendCompleteGroupMemberStreakTaskDeletedResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-132`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GetCompleteGroupMemberStreakTasksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetCompleteGroupMemberStreakTasksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-133`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendCompleteGroupMemberStreakTasksResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendCompleteGroupMemberStreakTasksResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-134`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateTeamStreakCreateMemberStreakFromRequestMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateTeamStreakCreateMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-135`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to UpdateTeamStreakMembersArray`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UpdateTeamStreakMembersArray);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-136`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PatchTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PatchTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-137`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendUpdatedTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendUpdatedTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-138`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateGroupMemberFriendExistsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateGroupMemberFriendExistsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-139`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateGroupMemberTeamStreakExistsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateGroupMemberTeamStreakExistsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-140`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendCreateGroupMemberResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendCreateGroupMemberResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-141`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateGroupMemberCreateGroupMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateGroupMemberCreateGroupMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-142`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to AddFriendToTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.AddFriendToTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-143`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteGroupMemberRetreiveTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteGroupMemberRetreiveTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-144`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetreiveGroupMemberMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveGroupMemberMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-145`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteGroupMemberMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteGroupMemberMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-146`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendGroupMemberDeletedResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendGroupMemberDeletedResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-147`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FindGroupMemberStreaksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FindGroupMemberStreaksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-148`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendGroupMemberStreaksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendGroupMemberStreaksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-149`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PatchUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PatchUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-150`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendUpdatedUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendUpdatedUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-151`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetreiveRequesterMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveRequesterMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-152`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetreiveRequesterMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveRequesteeMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-153`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RequesteeIsAlreadyAFriendMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RequesteeIsAlreadyAFriendMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-154`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SaveFriendRequestToDatabaseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SaveFriendRequestToDatabaseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-155`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendFriendRequestMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendFriendRequestMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-156`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FindFriendRequestsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FindFriendRequestsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-157`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendFriendRequestsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendFriendRequestsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-158`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteFriendRequestMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteFriendRequestMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-159`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendFriendRequestDeletedResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendFriendRequestDeletedResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-160`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetreiveFriendRequestMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveFriendRequestMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-161`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to UpdateFriendRequestStatusMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UpdateFriendRequestStatusMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-162`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PatchFriendRequestMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PatchFriendRequestMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-163`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendUpdatedFriendRequestMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendUpdatedFriendRequestMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-164`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PopulateFriendRequestMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PopulateFriendRequestsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-165`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PopulateFriendRequestMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PopulateFriendRequestMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-166`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PopulateUpdatedFriendRequestMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DefineUpdatedPopulatedFriendRequest);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-167`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PopulateTeamStreakMembersInformation`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PopulateTeamStreakMembersInformation);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-168`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetreiveCreatedTeamStreakCreatorInformationMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveCreatedTeamStreakCreatorInformationMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-169`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to AddUserToFriendsFriendListMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.AddUserToFriendsFriendListMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-170`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetreiveFormattedRequesterMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveFormattedRequesterMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-171`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetreiveFormattedRequesteeMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveFormattedRequesteeMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-172`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SetTaskIncompleteTimeMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SetTaskIncompleteTimeMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-173`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SetDayTaskWasIncompletedMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SetDayTaskWasIncompletedMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-174`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateIncompleteSoloStreakTaskDefinitionMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteSoloStreakTaskDefinitionMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-175`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SaveTaskIncompleteMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SaveTaskIncompleteMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-176`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendTaskIncompleteResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendTaskIncompleteResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-177`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateIncompleteSoloStreakTaskSoloStreakExistsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteSoloStreakTaskSoloStreakExistsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-178`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateIncompleteSoloStreakTaskRetreiveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteSoloStreakTaskRetreiveUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-179`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to IncompleteSoloStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.IncompleteSoloStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-180`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteIncompleteSoloStreakTaskMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteIncompleteSoloStreakTaskMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-181`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendIncompleteSoloStreakTaskDeletedResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendIncompleteSoloStreakTaskDeletedResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-182`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GetIncompleteSoloStreakTasksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetIncompleteSoloStreakTasksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-183`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendIncompleteSoloStreakTasksResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendIncompleteSoloStreakTasksResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-184`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to EnsureSoloStreakTaskHasBeenCompletedTodayMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.EnsureSoloStreakTaskHasBeenCompletedTodayMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-185`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to ResetStreakStartDateMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ResetStreakStartDateMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-186`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to EnsureSoloStreakTaskHasNotBeenCompletedTodayMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.EnsureSoloStreakTaskHasNotBeenCompletedTodayMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-187`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to EnsureGroupMemberStreakTaskHasNotBeenCompletedTodayMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.EnsureGroupMemberStreakTaskHasNotBeenCompletedTodayMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-188`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateIncompleteGroupMemberStreakTaskGroupMemberStreakExistsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.CreateIncompleteGroupMemberStreakTaskGroupMemberStreakExistsMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-189`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to EnsureGroupMemberStreakTaskHasBeenCompletedTodayMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.EnsureGroupMemberStreakTaskHasBeenCompletedTodayMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-190`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateIncompleteGroupMemberStreakTaskRetreiveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteGroupMemberStreakTaskRetreiveUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-191`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateIncompleteGroupMemberStreakSetTaskIncompleteTimeMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteGroupMemberStreakSetTaskIncompleteTimeMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-192`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateIncompleteGroupMemberStreakSetDayTaskWasIncompletedMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.CreateIncompleteGroupMemberStreakSetDayTaskWasIncompletedMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-193`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateIncompleteGroupMemberStreakTaskDefinitionMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteGroupMemberStreakTaskDefinitionMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-194`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SaveGroupMemberStreakTaskIncompleteMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SaveGroupMemberStreakTaskIncompleteMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-195`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to IncompleteGroupMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.IncompleteGroupMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-196`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendGroupMemberStreakTaskIncompleteResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendGroupMemberStreakTaskIncompleteResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-197`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to ResetGroupMemberStreakStartDateMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ResetGroupMemberStreakStartDateMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-198`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteIncompleteGroupMemberStreakTaskMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteIncompleteGroupMemberStreakTaskMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-199`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendIncompleteGroupMemberStreakTaskDeletedResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendIncompleteGroupMemberStreakTaskDeletedResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-200`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GetIncompleteGroupMemberStreakTasksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetIncompleteGroupMemberStreakTasksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-201`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendIncompleteGroupMemberStreakTasksResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendIncompleteGroupMemberStreakTasksResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-202`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PatchGroupMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PatchGroupMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-203`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendUpdatedGroupMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendUpdatedGroupMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-204`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });
});
