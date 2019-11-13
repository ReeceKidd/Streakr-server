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

    test(`creates correct error when type is set to CreateTeamMemberStreakUserDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateTeamMemberStreakUserDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-30`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CreateTeamMemberStreakTeamStreakDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateTeamMemberStreakTeamStreakDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-31`);
        expect(message).toBe('Team streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to NoTeamMemberStreakToDeleteFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NoTeamMemberStreakToDeleteFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-32`);
        expect(message).toBe('Team member streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to TeamMemberStreakDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.TeamMemberStreakDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-33`);
        expect(message).toBe('Team member streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to GetTeamMemberStreakNoTeamMemberStreakFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetTeamMemberStreakNoTeamMemberStreakFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-34`);
        expect(message).toBe('Team member streak does not exist.');
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

    test(`creates correct error when type is set to NoCompleteTeamMemberStreakTaskToDeleteFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NoCompleteTeamMemberStreakTaskToDeleteFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-36`);
        expect(message).toBe('Team member streak task does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to TeamMemberDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.TeamMemberDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-37`);
        expect(message).toBe('Team member does not exist.');
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

    test(`creates correct error when type is set to CreateTeamMemberFriendDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateTeamMemberFriendDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-39`);
        expect(message).toBe('Friend does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CreateTeamMemberTeamStreakDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateTeamMemberTeamStreakDoesNotExist);
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

    test(`creates correct error when type is set to NoTeamMemberFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NoTeamMemberFound);
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

    test(`creates correct error when type is set to CreateIncompleteTeamMemberStreakTaskTeamMemberStreakDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteTeamMemberStreakTaskTeamMemberStreakDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-56`);
        expect(message).toBe('Team member streak task does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CreateIncompleteTeamMemberStreakTaskUserDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteTeamMemberStreakTaskUserDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-58`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to NoIncompleteTeamMemberStreakTaskToDeleteFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NoIncompleteTeamMemberStreakTaskToDeleteFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-59`);
        expect(message).toBe('Team member streak task does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to UpdatedTeamMemberStreakNotFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UpdatedTeamMemberStreakNotFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-60`);
        expect(message).toBe('Team member streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CreateCompleteTeamStreakTeamStreakDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteTeamStreakTeamStreakDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-61`);
        expect(message).toBe('Team streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CreateCompleteTeamStreakUserDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteTeamStreakUserDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-62`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to NoCompleteTeamStreakToDeleteFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NoCompleteTeamStreakToDeleteFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-63`);
        expect(message).toBe('Complete team streak task does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CompleteTeamMemberStreakTaskTeamMemberStreakDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CompleteTeamMemberStreakTaskTeamMemberStreakDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-64`);
        expect(message).toBe('Team member streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to FriendRequestAlreadySent`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FriendRequestAlreadySent);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-65`);
        expect(message).toBe('Friend request already sent.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to StripeTokenMissingId`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.StripeTokenMissingId);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-66`);
        expect(message).toBe('Stripe token missing id.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to StripeTokenMissingEmail`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.StripeTokenMissingEmail);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-67`);
        expect(message).toBe('Stripe token missing email.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to InvalidImageFormat`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.InvalidImageFormat);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-68`);
        expect(message).toBe('Invalid image format.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to NoImageInRequest`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NoImageInRequest);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-69`);
        expect(message).toBe('No image in request.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to DeleteFriendNoFriendFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteFriendNoFriendFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-70`);
        expect(message).toBe('Friend does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CreateIncompleteTeamMemberStreakTaskTeamStreakDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteTeamMemberStreakTaskTeamStreakDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-71`);
        expect(message).toBe('Team streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to IncompleteTeamMemberStreakTaskTeamMemberStreakDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.IncompleteTeamMemberStreakTaskTeamMemberStreakDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-72`);
        expect(message).toBe('Team member streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to RegisterDeviceForPushNotificationUserNotFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RegisterDeviceForPushNotificationUserNotFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-73`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to UpdateCurrentUserNotFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UpdateCurrentUserNotFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-74`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to TokenDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.TokenDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`401-01`);
        expect(message).toBe('Not authorized.');
        expect(httpStatusCode).toBe(401);
    });

    test(`creates correct error when type is set to AuthUserDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.AuthUserDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`401-02`);
        expect(message).toBe('Not authorized.');
        expect(httpStatusCode).toBe(401);
    });

    test(`creates correct error when type is set to AuthInvalidTokenNoCognitoUsername`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.AuthInvalidTokenNoCognitoUsername);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`401-03`);
        expect(message).toBe('Not authorized.');
        expect(httpStatusCode).toBe(401);
    });

    test(`creates correct error when type is set to AudienceDoesNotMatchCognitoAppClientId`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.AudienceDoesNotMatchCognitoAppClientId);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`401-04`);
        expect(message).toBe('Not authorized.');
        expect(httpStatusCode).toBe(401);
    });

    test(`creates correct error when type is set to UserHasNotPaidMembership`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UserHasNotPaidMembership);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`401-05`);
        expect(message).toBe('Not authorized.');
        expect(httpStatusCode).toBe(401);
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

    test(`creates correct error when type is set to TeamMemberStreakTaskTaskHasBeenCompletedToday`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.TeamMemberStreakTaskHasBeenCompletedToday);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`422-03`);
        expect(message).toBe('Team member streak task already completed today.');
        expect(httpStatusCode).toBe(422);
    });

    test(`creates correct error when type is set to TeamMemberStreakHasNotBeenCompletedToday`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.TeamMemberStreakHasNotBeenCompletedToday);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`422-04`);
        expect(message).toBe('Team member streak task has not been completed today.');
        expect(httpStatusCode).toBe(422);
    });

    test(`creates correct error when type is set to TeamStreakHasBeenCompletedToday`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.TeamStreakHasBeenCompletedToday);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`422-05`);
        expect(message).toBe('Team streak task already completed today.');
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

    test(`creates correct error when type is set to UpdateUserMembershipInformationMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UpdateUserMembershipInformationMiddleware);
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

    test(`creates correct error when type is set to SendUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendUserMiddleware);
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

    test(`creates correct error when type is set to CreateTeamMemberStreakFromRequestMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateTeamMemberStreakFromRequestMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-110`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SaveTeamMemberStreakToDatabaseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SaveTeamMemberStreakToDatabaseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-111`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendFormattedTeamMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendFormattedTeamMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-112`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateTeamMemberStreakRetreiveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateTeamMemberStreakRetreiveUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-113`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateTeamMemberStreakRetreiveTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateTeamMemberStreakRetreiveTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-114`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteTeamMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteTeamMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-115`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendTeamMemberStreakDeletedResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendTeamMemberStreakDeletedResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-116`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to TeamMemberStreakExistsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.TeamMemberStreakExistsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-117`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteTeamMemberStreakTaskRetreiveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteTeamMemberStreakTaskRetreiveUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-118`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SetTeamMemberStreakTaskCompleteTimeMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SetTeamMemberStreakTaskCompleteTimeMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-119`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SetTeamMemberStreakStartDateMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SetTeamMemberStreakStartDateMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-120`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SetDayTeamMemberStreakTaskWasCompletedMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SetDayTeamMemberStreakTaskWasCompletedMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-121`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to HasTeamMemberStreakTaskAlreadyBeenCompletedTodayMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.HasTeamMemberStreakTaskAlreadyBeenCompletedTodayMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-122`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SaveTeamMemberStreakTaskCompleteMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SaveTeamMemberStreakTaskCompleteMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-123`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to TeamMemberStreakMaintainedMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.TeamMemberStreakMaintainedMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-124`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendCompleteTeamMemberStreakTaskResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendCompleteTeamMemberStreakTaskResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-125`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteTeamMemberStreakTaskDefinitionMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteTeamMemberStreakTaskDefinitionMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-126`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetreiveTeamMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveTeamMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-127`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendTeamMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendTeamMemberStreakMiddleware);
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

    test(`creates correct error when type is set to CreateCompleteTeamMemberStreakTaskMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteTeamMemberStreakTaskMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-130`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteCompleteTeamMemberStreakTaskMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteCompleteTeamMemberStreakTaskMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-131`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendCompleteTeamMemberStreakTaskDeletedResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendCompleteTeamMemberStreakTaskDeletedResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-132`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GetCompleteTeamMemberStreakTasksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetCompleteTeamMemberStreakTasksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-133`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendCompleteTeamMemberStreakTasksResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendCompleteTeamMemberStreakTasksResponseMiddleware);
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

    test(`creates correct error when type is set to CreateTeamMemberFriendExistsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateTeamMemberFriendExistsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-139`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateTeamMemberTeamStreakExistsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateTeamMemberTeamStreakExistsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-140`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendCreateTeamMemberResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendCreateTeamMemberResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-141`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateTeamMemberCreateTeamMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateTeamMemberCreateTeamMemberStreakMiddleware);
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

    test(`creates correct error when type is set to DeleteTeamMemberRetreiveTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteTeamMemberRetreiveTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-144`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetreiveTeamMemberMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveTeamMemberMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-145`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteTeamMemberMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteTeamMemberMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-146`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendTeamMemberDeletedResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendTeamMemberDeletedResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-147`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FindTeamMemberStreaksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FindTeamMemberStreaksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-148`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendTeamMemberStreaksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendTeamMemberStreaksMiddleware);
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

    test(`creates correct error when type is set to EnsureTeamMemberStreakTaskHasNotBeenCompletedTodayMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.EnsureTeamMemberStreakTaskHasNotBeenCompletedTodayMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-188`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateIncompleteTeamMemberStreakTaskTeamMemberStreakExistsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.CreateIncompleteTeamMemberStreakTaskTeamMemberStreakExistsMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-189`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to EnsureTeamMemberStreakTaskHasBeenCompletedTodayMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.EnsureTeamMemberStreakTaskHasBeenCompletedTodayMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-190`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateIncompleteTeamMemberStreakTaskRetreiveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteTeamMemberStreakTaskRetreiveUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-191`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateIncompleteTeamMemberStreakSetTaskIncompleteTimeMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteTeamMemberStreakSetTaskIncompleteTimeMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-192`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateIncompleteTeamMemberStreakSetDayTaskWasIncompletedMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.CreateIncompleteTeamMemberStreakSetDayTaskWasIncompletedMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-193`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateIncompleteTeamMemberStreakTaskDefinitionMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteTeamMemberStreakTaskDefinitionMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-194`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SaveTeamMemberStreakTaskIncompleteMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SaveTeamMemberStreakTaskIncompleteMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-195`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to IncompleteTeamMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.IncompleteTeamMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-196`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendTeamMemberStreakTaskIncompleteResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendTeamMemberStreakTaskIncompleteResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-197`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to ResetTeamMemberStreakStartDateMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ResetTeamMemberStreakStartDateMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-198`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteIncompleteTeamMemberStreakTaskMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteIncompleteTeamMemberStreakTaskMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-199`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendIncompleteTeamMemberStreakTaskDeletedResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendIncompleteTeamMemberStreakTaskDeletedResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-200`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GetIncompleteTeamMemberStreakTasksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetIncompleteTeamMemberStreakTasksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-201`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendIncompleteTeamMemberStreakTasksResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendIncompleteTeamMemberStreakTasksResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-202`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PatchTeamMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PatchTeamMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-203`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendUpdatedTeamMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendUpdatedTeamMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-204`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to ValidateStreakTrackingEventBody`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ValidateStreakTrackingEventBody);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-205`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to ValidateDailyJobBody`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ValidateDailyJobBody);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-206`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateDailyJobFromRequestMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateDailyJobFromRequestMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-207`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendFormattedDailyJobMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendFormattedDailyJobMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-208`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteTeamStreakTeamStreakExistsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteTeamStreakTeamStreakExistsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-209`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to EnsureTeamStreakTaskHasNotBeenCompletedTodayMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.EnsureTeamStreakTaskHasNotBeenCompletedTodayMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-210`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteTeamStreakRetreiveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteTeamStreakRetreiveUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-211`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteTeamStreakSetTaskCompleteTimeMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteTeamStreakSetTaskCompleteTimeMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-212`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteTeamStreakSetStreakStartDateMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteTeamStreakSetStreakStartDateMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-213`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteTeamStreakSetDayTaskWasCompletedMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteTeamStreakSetDayTaskWasCompletedMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-214`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteTeamStreakDefinitionMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteTeamStreakDefinitionMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-215`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteTeamStreakSaveTaskCompleteMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteTeamStreakSaveTaskCompleteMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-216`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteTeamStreakStreakMaintainedMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteTeamStreakStreakMaintainedMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-217`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteTeamStreakSendTaskCompleteResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteTeamStreakSendTaskCompleteResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-218`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GetCompleteTeamStreaksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetCompleteTeamStreaksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-219`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendCompleteTeamStreaksResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendCompleteTeamStreaksResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-220`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteCompleteTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteCompleteTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-221`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendCompleteTeamStreakDeletedResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendCompleteTeamStreakDeletedResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-222`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DecodeJWTMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DecodeJWTMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-223`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to AuthRetreiveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.AuthRetreiveUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-224`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to EnsureAudienceMatchesCognitoUserPool`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.EnsureAudienceMatchesCognitoUserPool);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-225`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to MakeTeamStreakActive`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.MakeTeamStreakActive);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-226`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to HaveAllTeamMembersCompletedTasksMiddlewares`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.HaveAllTeamMembersCompletedTasksMiddlewares);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-227`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SetTeamStreakToActive`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SetTeamStreakToActive);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-228`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FindDailyJobsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FindDailyJobsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-229`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendDailyJobsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendDailyJobsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-230`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FormatUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FormatUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-231`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FormatUpdatedUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FormatUpdatedUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-232`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateEmailFromRequestMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateEmailFromRequestMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-233`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SaveEmailToDatabaseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SaveEmailToDatabaseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-234`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to EmailSentResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.EmailSentResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-235`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendEmailMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendEmailMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-236`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to HasRequesterAlreadySentInvite`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.HasRequesterAlreadySentInvite);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-237`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to ValidateStripeTokenMiddlware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ValidateStripeTokenMiddlware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-238`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FileValidationMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ImageTypeValidationMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-239`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to ManipulateProfilePictureMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ManipulateProfilePictureMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-240`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GetSingleImageUploadMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetSingleImageUploadMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-241`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to S3UploadAvatarImage`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.S3UploadAvatarImage);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-242`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to S3UploadOriginalImage`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.S3UploadOriginalImage);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-243`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DefineProfilePictures`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DefineProfilePictures);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-244`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SetUserProfilePictures`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SetUserProfilePictures);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-245`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendProfilePictures`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendProfilePictures);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-246`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GetFriendsInfoMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetFriendsInfoMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-247`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteFriendRetreiveFriendMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteFriendRetreiveFriendMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-248`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteUserFromFriendsFriendListMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteUserFromFriendsFriendListMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-249`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GetIncompleteTeamStreaksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetIncompleteTeamStreaksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-250`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendIncompleteTeamStreaksResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendIncompleteTeamStreaksResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-251`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateIncompleteTeamMemberStreakTaskTeamStreakExistsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteTeamMemberStreakTaskTeamStreakExistsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-252`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to ResetTeamStreakStartDateMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ResetTeamStreakStartDateMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-253`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to IncompleteTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.IncompleteTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-254`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateTeamStreakIncomplete`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateTeamStreakIncomplete);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-255`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to HasOneTeamMemberCompletedTaskMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.HasOneTeamMemberCompletedTaskMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-256`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to MakeTeamStreakInactiveMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.MakeTeamStreakInactiveMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-257`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to HasUserPaidMembershipMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.HasUserPaidMembershipMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-258`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RegisterDeviceForPushNotificationRetreiveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RegisterDeviceForPushNotificationRetreiveUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-259`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreatePlatformEndpointMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreatePlatformEndpointMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-260`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendSuccessfullyRegisteredDevice`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendSuccessfullyRegisteredDevice);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-261`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateTopicSubscriptionMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateTopicSubscriptionMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-262`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to UpdateUserPushNotificationInformationMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UpdateUserPushNotificationInformationMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-263`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendRequesteeAFriendRequestNotification`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendRequesteeAFriendRequestNotification);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-264`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RegisterUserFormatUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RegisterUserFormatUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-265`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateStripeSubscriptionFormatUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateStripeSubscriptionFormatUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-266`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendCurrentUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendCurrentUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-267`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PatchCurrentUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PatchCurrentUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-268`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendUpdatedCurrentUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendUpdatedCurrentUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-269`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GetCurrentUserFormatUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetCurrentUserFormatUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-270`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PatchCurrentUserFormatUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PatchCurrentUserFormatUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-271`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to NotifyteamMembersThatUserHasCompletedTask`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NotifyTeamMembersThatUserHasCompletedTaskMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-272`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteTeamMemberStreakTaskRetreiveTeamMembersMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteTeamMemberStreakTaskRetreiveTeamMembersMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-273`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });
});
