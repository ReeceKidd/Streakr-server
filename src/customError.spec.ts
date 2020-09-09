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

    test(`creates correct error when type is set to UnfollowUserNoSelectedUserFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UnfollowUserNoSelectedUserFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-21`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to UserToUnfollowDoesNotExistInSelectedUsersFollowing`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UserToUnfollowDoesNotExistInSelectedUsersFollowing);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-22`);
        expect(message).toBe('Friend does not exist.');
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

    test(`creates correct error when type is set to CreateTeamMemberUserDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateTeamMemberUserDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-39`);
        expect(message).toBe('New team member does not exist.');
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

    test(`creates correct error when type is set to AddFriendToUsersFriendListNotFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.AddFriendToUsersFriendListNotFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-50`);
        expect(message).toBe('Friend does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to RetrieveFormattedRequesteeDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveFormattedRequesteeDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-51`);
        expect(message).toBe('Requestee does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to RetrieveFormattedRequesterDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveFormattedRequesterDoesNotExist);
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

    test(`creates correct error when type is set to NoChallengeFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NoChallengeFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-75`);
        expect(message).toBe('Challenge does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to GetChallengeStreakNoChallengeStreakFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetChallengeStreakNoChallengeStreakFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-76`);
        expect(message).toBe('Challenge streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to ChallengeStreakDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ChallengeStreakDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-77`);
        expect(message).toBe('Challenge streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CreateCompleteChallengeStreakTaskUserDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteChallengeStreakTaskUserDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-78`);
        expect(message).toBe('Challenge streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CreateIncompleteChallengeStreakTaskChallengeStreakDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteChallengeStreakTaskChallengeStreakDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-79`);
        expect(message).toBe('Challenge streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CreateIncompleteChallengeStreakTaskUserDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteChallengeStreakTaskUserDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-80`);
        expect(message).toBe('Challenge streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to UpdatedChallengeStreakNotFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UpdatedChallengeStreakNotFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-81`);
        expect(message).toBe('Challenge streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to UserIsAlreadyInChallenge`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UserIsAlreadyInChallenge);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-82`);
        expect(message).toBe('User is already in challenge.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CreateChallengeStreakChallengeDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateChallengeStreakChallengeDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-83`);
        expect(message).toBe('Challenge does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CreateChallengeStreakUserDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateChallengeStreakUserDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-84`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to GetNoNoteFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetNoNoteFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-86`);
        expect(message).toBe('Note does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to NoNoteToDeleteFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NoNoteToDeleteFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-87`);
        expect(message).toBe('Note does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CreateNoteUserDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateNoteUserDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-88`);
        expect(message).toBe('Team streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to NotifyTeamMembersThatUserHasAddedANoteTeamStreakDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NotifyTeamMembersThatUserHasAddedANoteTeamStreakDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-89`);
        expect(message).toBe('Team streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to GetFollowersUserDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetFollowersUserDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-90`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to SelectedUserDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SelectedUserDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-91`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to SelectedUserIsAlreadyFollowingUser`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SelectedUserIsAlreadyFollowingUser);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-92`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to UserToFollowDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UserToFollowDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-93`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to NoUserToFollowFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NoUserToFollowFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-94`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CreateCompleteChallengeStreakTaskChallengeDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteChallengeStreakTaskChallengeDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-95`);
        expect(message).toBe('Challenge does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CreateIncompleteChallengeStreakTaskChallengeDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteChallengeStreakTaskChallengeDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-96`);
        expect(message).toBe('Challenge does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to PatchChallengeStreakNoChallengeFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PatchChallengeStreakNoChallengeFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-97`);
        expect(message).toBe('Challenge does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to UpdateCurrentUsersPushNotificationsUserNotFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UpdateCurrentUsersPushNotificationsUserNotFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-98`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to OneHundredDaySoloStreakAchievementDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.OneHundredDaySoloStreakAchievementDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-99`);
        expect(message).toBe('OneHundredDaySoloStreakAchievement does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to UnsupportedDeviceType`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UnsupportedDeviceType);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-100`);
        expect(message).toBe('Unsupported device type.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to UserIdentifierExists`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UserIdentifierExists);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-101`);
        expect(message).toBe('User identifier already exists.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to PatchCurrentUserEmailAlreadyExists`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PatchCurrentUserEmailAlreadyExists);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-102`);
        expect(message).toBe('Email already exists.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to PatchCurrentUserUsernameAlreadyExists`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PatchCurrentUserUsernameAlreadyExists);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-103`);
        expect(message).toBe('Username already exists.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to AuthenticatedUserNotFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.AuthenticatedUserNotFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-104`);
        expect(message).toBe('Authenticated user not found.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to TeamMemberIsAlreadyInTeamStreak`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.TeamMemberIsAlreadyInTeamStreak);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-105`);
        expect(message).toBe('Team member is already in team streak.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to OneHundredDayChallengeStreakAchievementDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.OneHundredDayChallengeStreakAchievementDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-106`);
        expect(message).toBe('One hundred day challenge streak achievement does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CreateAndroidPlatformEndpointFailure`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateAndroidPlatformEndpointFailure);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-107`);
        expect(message).toBe('Error with android token.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CreateIosPlatformEndpointFailure`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIosPlatformEndpointFailure);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-108`);
        expect(message).toBe('Error with ios token.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to GetTeamStreakInviteNoTeamStreakFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetTeamStreakInviteNoTeamStreakFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-109`);
        expect(message).toBe('Team streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to RecoverChallengeStreakChallengeStreakNotFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RecoverChallengeStreakChallengeStreakNotFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-110`);
        expect(message).toBe('Challenge streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to RecoverChallengeStreakChallengeNoLostStreak`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RecoverChallengeStreakChallengeNoLostStreak);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-111`);
        expect(message).toBe('Challenge streak has no past streaks.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to RecoverSoloStreakSoloNoLostStreak`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RecoverSoloStreakSoloNoLostStreak);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-112`);
        expect(message).toBe('Solo streak has no past streaks.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to RecoverSoloStreakSoloStreakNotFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RecoverSoloStreakSoloStreakNotFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-113`);
        expect(message).toBe('Solo streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to CannotDeleteTeamMemberUserIsNotApartOfTeamStreak`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CannotDeleteTeamMemberUserIsNotApartOfTeamStreak);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-114`);
        expect(message).toBe('Cannot delete team member user is not apart of team streak.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to RecoverChallengeStreakUserDoesNotHaveEnoughCoins`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RecoverChallengeStreakUserDoesNotHaveEnoughCoins);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-115`);
        expect(message).toBe('User does not have enough coins to recover challenge streak.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to RecoverSoloStreakUserDoesNotHaveEnoughCoins`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RecoverSoloStreakUserDoesNotHaveEnoughCoins);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-116`);
        expect(message).toBe('User does not have enough coins to recover solo streak.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to RecoverTeamMemberStreakTeamMemberStreakNotFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RecoverTeamMemberStreakTeamMemberStreakNotFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-117`);
        expect(message).toBe('Team member streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to RecoverTeamMemberStreakTeamStreakNotFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RecoverTeamMemberStreakTeamStreakNotFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-118`);
        expect(message).toBe('Team streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to RecoverTeamMemberStreakUserDoesNotHaveEnoughCoins`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RecoverTeamMemberStreakUserDoesNotHaveEnoughCoins);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-119`);
        expect(message).toBe('User does not have enough coins to recover team member streak.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to RecoverTeamMemberStreakNoLostStreak`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RecoverTeamMemberStreakNoLostStreak);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-120`);
        expect(message).toBe('Team member streak has no past streaks.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to RecoverTeamStreakNoLostStreak`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RecoverTeamStreakNoLostStreak);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-121`);
        expect(message).toBe('Team streak has no past streaks.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to RecoverChallengeStreakChallengeNotFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RecoverChallengeStreakChallengeNotFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-122`);
        expect(message).toBe('Challenge does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to NoTeamMemberStreakFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NoTeamMemberStreakFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-123`);
        expect(message).toBe('No team member streak found.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to OneHundredDayTeamMemberStreakAchievementDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.OneHundredDayTeamMemberStreakAchievementDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-124`);
        expect(message).toBe('One hundred day team member streak does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to UserIsNotAStripeCustomer`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UserIsNotAStripeCustomer);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-125`);
        expect(message).toBe('User is not a stripe customer.');
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

    test(`creates correct error when type is set to ChallengeStreakHasBeenCompletedToday`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ChallengeStreakHasBeenCompletedToday);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`422-06`);
        expect(message).toBe('Challenge streak task already completed today.');
        expect(httpStatusCode).toBe(422);
    });

    test(`creates correct error when type is set to ChallengeStreakHasNotBeenCompletedToday`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ChallengeStreakHasNotBeenCompletedToday);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`422-07`);
        expect(message).toBe('Challenge streak has not been completed today.');
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

    test(`creates correct error when type is set to RetrieveUserWithEmailMiddlewareError`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveUserWithEmailMiddlewareError);
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

    test(`creates correct error when type is set to RetrieveTimezoneHeaderMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveTimezoneHeaderMiddleware);
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

    test(`creates correct error when type is set to RetrieveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveUserMiddleware);
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

        const customError = new CustomError(ErrorType.IncreaseNumberOfDaysInARowForSoloStreakMiddleware);
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

    test(`creates correct error when type is set to RetrieveSoloStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveSoloStreakMiddleware);
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

    test(`creates correct error when type is set to FindUsersMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FindUsersMiddleware);
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

    test(`creates correct error when type is set to SendUserUnfollowedResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendUserUnfollowedResponseMiddleware);
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

    test(`creates correct error when type is set to GetRetrieveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetRetrieveUserMiddleware);
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

    test(`creates correct error when type is set to RetrieveIncompleteSoloStreaksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveIncompleteSoloStreaksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-66`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetrieveFriendsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveFriendsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-67`);
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

    test(`creates correct error when type is set to SendUserWithNewFriendMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendUserWithNewFriendMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-72`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteUserGetRetrievedUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UnfollowUserRetrieveSelectedUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-74`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DoesUserToUnfollowExistInSelectedUsersFollowingMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DoesUserToUnfollowExistInSelectedUsersFollowingMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-75`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to UnfollowUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UnfollowUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-76`);
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

    test(`creates correct error when type is set to RetrieveTeamStreaksMembersInformation`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveTeamStreaksMembersInformation);
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

    test(`creates correct error when type is set to RetrieveTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveTeamStreakMiddleware);
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

    test(`creates correct error when type is set to RetrieveTeamStreakMembersInformation`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveTeamStreakMembersInformation);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-92`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SaveStreakTrackingEventToDatabase`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SaveStreakTrackingEventToDatabase);
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

    test(`creates correct error when type is set to RetrieveStreakTrackingEventMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveStreakTrackingEventMiddleware);
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

    test(`creates correct error when type is set to RetrieveTeamStreakCreatorInformationMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveTeamStreakCreatorInformationMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-109`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateTeamMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateTeamMemberStreakMiddleware);
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

    test(`creates correct error when type is set to CreateTeamMemberStreakRetrieveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateTeamMemberStreakRetrieveUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-113`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateTeamMemberStreakRetrieveTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateTeamMemberStreakRetrieveTeamStreakMiddleware);
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

    test(`creates correct error when type is set to CreateCompleteTeamMemberStreakTaskRetrieveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteTeamMemberStreakTaskRetrieveUserMiddleware);
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

    test(`creates correct error when type is set to RetrieveTeamMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveTeamMemberStreakMiddleware);
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

    test(`creates correct error when type is set to CreateTeamMemberUserExistsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateTeamMemberUserExistsMiddleware);
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

    test(`creates correct error when type is set to AddUserToTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.AddUserToTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-143`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteTeamMemberRetrieveTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteTeamMemberRetrieveTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-144`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetrieveTeamMemberMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveTeamMemberMiddleware);
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

    test(`creates correct error when type is set to RetrieveRequesterMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveRequesterMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-152`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetrieveRequesterMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveRequesteeMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-153`);
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

    test(`creates correct error when type is set to RetrieveCreatedTeamStreakCreatorInformationMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveCreatedTeamStreakCreatorInformationMiddleware);
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

    test(`creates correct error when type is set to RetrieveFormattedRequesterMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveFormattedRequesterMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-171`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetrieveFormattedRequesteeMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveFormattedRequesteeMiddleware);
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

    test(`creates correct error when type is set to CreateIncompleteSoloStreakTaskRetrieveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteSoloStreakTaskRetrieveUserMiddleware);
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

    test(`creates correct error when type is set to CreateIncompleteTeamMemberStreakTaskRetrieveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteTeamMemberStreakTaskRetrieveUserMiddleware);
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

    test(`creates correct error when type is set to CreateCompleteTeamStreakRetrieveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteTeamStreakRetrieveUserMiddleware);
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

    test(`creates correct error when type is set to AuthRetrieveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.AuthRetrieveUserMiddleware);
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

    test(`creates correct error when type is set to ValidateStripeTokenMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ValidateStripeTokenMiddleware);
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

    test(`creates correct error when type is set to IsImageInRequestMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.IsImageInRequestMiddleware);
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

    test(`creates correct error when type is set to DeleteFriendRetrieveFriendMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteFriendRetrieveFriendMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-248`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteSelectedUserFromUserToUnfollowFollowersMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteSelectedUserFromUserToUnfollowFollowersMiddleware);
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

    test(`creates correct error when type is set to RegisterDeviceForPushNotificationRetrieveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RegisterDeviceForPushNotificationRetrieveUserMiddleware);
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

    test(`creates correct error when type is set to CreateCompleteTeamMemberStreakTaskRetrieveTeamMembersMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteTeamMemberStreakTaskRetrieveTeamMembersMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-273`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateStreakRecommendationFromRequestMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateStreakRecommendationFromRequestMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-274`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SaveStreakRecommendationToDatabaseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SaveStreakRecommendationToDatabaseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-275`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendFormattedStreakRecommendationMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendFormattedStreakRecommendationMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-276`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateIncompleteTeamMemberStreakTaskRetrieveTeamMembersMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.CreateIncompleteTeamMemberStreakTaskRetrieveTeamMembersMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-277`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendStreakRecommendationsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendStreakRecommendationsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-278`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FindStreakRecommendationsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FindStreakRecommendationsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-279`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateChallengeFromRequestMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateChallengeFromRequestMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-284`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendFormattedChallengeMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendFormattedChallengeMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-285`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FormChallengesQueryMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FormChallengesQueryMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-286`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendChallengesMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendChallengesMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-287`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GetRetrieveChallengeMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetRetrieveChallengeMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-288`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendChallengeMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendChallengeMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-289`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateChallengeStreakFromRequestMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateChallengeStreakFromRequestMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-290`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendFormattedChallengeStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendFormattedChallengeStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-291`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FindChallengeStreaksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FindChallengeStreaksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-292`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendChallengeStreaksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendChallengeStreaksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-293`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetrieveChallengeStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveChallengeStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-294`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendChallengeStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendChallengeStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-295`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to ChallengeStreakExistsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ChallengeStreakExistsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-296`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to EnsureChallengeStreakTaskHasNotBeenCompletedTodayMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.EnsureChallengeStreakTaskHasNotBeenCompletedTodayMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-297`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteChallengeStreakTaskRetrieveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteChallengeStreakTaskRetrieveUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-298`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteChallengeStreakTaskSetTaskCompleteTimeMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteChallengeStreakTaskSetTaskCompleteTimeMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-299`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteChallengeStreakTaskSetStreakStartDateMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteChallengeStreakTaskSetStreakStartDateMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-300`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteChallengeStreakTaskSetDayTaskWasCompletedMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.CreateCompleteChallengeStreakTaskSetDayTaskWasCompletedMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-301`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to .CreateCompleteChallengeStreakTaskDefinitionMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteChallengeStreakTaskDefinitionMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-302`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteChallengeStreakTaskIncreaseNumberOfDaysInARowForChallengeStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.CreateCompleteChallengeStreakTaskIncreaseNumberOfDaysInARowForChallengeStreakMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-303`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteChallengeStreakTaskSendTaskCompleteResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.CreateCompleteChallengeStreakTaskSendTaskCompleteResponseMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-304`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteChallengeStreakTaskSaveTaskCompleteMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteChallengeStreakTaskSaveTaskCompleteMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-305`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateIncompleteChallengeStreakTaskChallengeStreakExistsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.CreateIncompleteChallengeStreakTaskChallengeStreakExistsMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-306`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateIncompleteChallengeStreakTaskChallengeStreakExistsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.EnsureChallengeStreakTaskHasBeenCompletedTodayMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-307`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateIncompleteChallengeStreakTaskRetrieveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteChallengeStreakTaskRetrieveUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-308`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateIncompleteChallengeStreakTaskDefinitionMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteChallengeStreakTaskDefinitionMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-309`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to IncompleteChallengeStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.IncompleteChallengeStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-310`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendChallengeTaskIncompleteResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendChallengeTaskIncompleteResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-311`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SaveChallengeTaskIncompleteMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SaveChallengeTaskIncompleteMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-312`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SetDayChallengeTaskWasIncompletedMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SetDayChallengeTaskWasIncompletedMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-313`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SetChallengeTaskIncompleteTimeMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SetChallengeTaskIncompleteTimeMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-314`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to ResetChallengeStreakStartDateMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ResetChallengeStreakStartDateMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-315`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PatchChallengeStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PatchChallengeStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-316`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendUpdatedChallengeStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendUpdatedChallengeStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-317`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to IsUserAlreadyInChallengeMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.IsUserAlreadyInChallengeMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-319`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to AddUserToChallengeMiddlewares`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.AddUserToChallengeMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-320`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DoesChallengeExistMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DoesChallengeExistMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-321`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateChallengeStreakDoesUserExistMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateChallengeStreakDoesUserExistMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-322`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GetChallengeMemberInformationMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetChallengeMemberInformationMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-323`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GetCompleteChallengeStreakTasksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetCompleteChallengeStreakTasksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-330`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendCompleteChallengeStreakTasksResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendCompleteChallengeStreakTasksResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-331`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateNoteFromRequestMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateNoteFromRequestMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-334`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendFormattedNoteMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendFormattedNoteMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-335`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FindNotesMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FindNotesMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-336`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendNotesMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendNotesMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-337`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetrieveNoteMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveNoteMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-338`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendNoteMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendNoteMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-339`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteNoteMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteNoteMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-340`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendNoteDeletedResponseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendNoteDeletedResponseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-341`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DetermineStripePaymentPlanMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DetermineStripePaymentPlanMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-342`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to NotifyTeamMembersThatUserHasAddedANoteMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NotifyTeamMembersThatUserHasAddedANoteMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-343`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FindActivityFeedItemsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FindActivityFeedItemsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-344`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendActivityFeedItemsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendActivityFeedItemsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-345`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateSoloStreakActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateSoloStreakActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-346`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteSoloStreakActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteSoloStreakActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-347`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateIncompleteSoloStreakActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteSoloStreakActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-348`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateTeamStreakActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateTeamStreakActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-349`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateJoinedTeamStreakActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateJoinedTeamStreakActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-350`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteTeamMemberStreakActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteTeamMemberStreakActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-351`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateIncompleteTeamMemberStreakActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteTeamMemberStreakActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-352`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateJoinChallengeActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateJoinChallengeActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-353`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateArchivedSoloStreakActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateArchivedSoloStreakActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-354`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateRestoredSoloStreakActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateRestoredSoloStreakActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-355`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateDeletedSoloStreakActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateDeletedSoloStreakActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-356`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteChallengeStreakActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteChallengeStreakActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-357`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateIncompleteChallengeStreakActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteChallengeStreakActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-358`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateArchivedChallengeStreakActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateArchivedChallengeStreakActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-359`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateRestoredChallengeStreakActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateRestoredChallengeStreakActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-360`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateDeletedChallengeStreakActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateDeletedChallengeStreakActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-361`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateArchivedTeamStreakActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateArchivedTeamStreakActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-362`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateRestoredTeamStreakActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateRestoredTeamStreakActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-363`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateDeletedTeamStreakActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateDeletedTeamStreakActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-364`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateEditedSoloStreakNameActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateEditedSoloStreakNameActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-365`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateEditedSoloStreakDescriptionActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateEditedSoloStreakDescriptionActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-366`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateEditedTeamStreakNameActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateEditedTeamStreakNameActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-367`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateEditedTeamStreakDescriptionActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateEditedTeamStreakDescriptionActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-368`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FormActivityFeedItemsQueryMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FormActivityFeedItemsQueryMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-369`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CalculateTotalCountOfActivityFeedItemsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CalculateTotalCountOfActivityFeedItemsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-370`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RemoveUserFromChallengeIfChallengeStreakIsDeletedMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RemoveUserFromChallengeIfChallengeStreakIsDeletedMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-371`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CountTotalUsersMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CountTotalUsersMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-372`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CountTotalUsersMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CountTotalLiveSoloStreaksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-373`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CountTotalLiveChallengeStreaksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CountTotalLiveChallengeStreaksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-374`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GetTotalLiveTeamStreaksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CountTotalLiveTeamStreaksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-375`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CountTotalStreaksCreatedMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CountTotalStreaksCreatedMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-376`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendDatabaseStatsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendDatabaseStatsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-377`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to IncreaseNumberOfMembersInChallengeMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.IncreaseNumberOfMembersInChallengeMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-378`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DescreaseNumberOfChallengeMembersWhenChallengeStreakIsDeletedMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.DescreaseNumberOfChallengeMembersWhenChallengeStreakIsDeletedMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-379`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FormUsersQueryMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FormUsersQueryMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-380`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CalculateTotalUsersCountMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CalculateTotalUsersCountMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-381`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GetFollowersRetrieveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetFollowersRetrieveUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-382`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GetFollowersInfoMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetFollowersInfoMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-383`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendFormattedFollowersMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendFormattedFollowersMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-384`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetrieveSelectedUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveSelectedUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-385`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to IsSelectedUserIsAlreadFollowingUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.IsSelectedUserIsAlreadFollowingUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-386`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetrieveUserToFollowMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveUserToFollowMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-387`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to AddUserToFollowToSelectedUsersFollowing`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.AddUserToFollowToSelectedUsersFollowing);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-388`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to AddSelectedUserToUserToFollowsFollowersMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.AddSelectedUserToUserToFollowFollowersMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-389`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendUserWithNewFollowingMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendUserWithNewFollowingMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-390`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PopulateUserFollowersMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PopulateUserFollowersMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-391`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PopulateUserFollowingMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PopulateUserFollowingMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-392`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PopulateCurrentUserFollowingMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PopulateCurrentUserFollowingMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-393`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PopulateCurrentUserFollowersMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PopulateCurrentUserFollowersMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-394`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PopulatePatchCurrentUserFollowingMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PopulatePatchCurrentUserFollowingMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-395`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PopulatePatchCurrentUserFollowersMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PopulatePatchCurrentUserFollowersMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-396`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreatedAccountActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreatedAccountActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-397`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateFollowUserActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateFollowUserActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-398`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SaveActivityFeedItemToDatabaseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SaveActivityFeedItemToDatabaseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-399`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-400`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateCompleteChallengeStreakTaskRetrieveChallengeMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCompleteChallengeStreakTaskRetrieveChallengeMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-401`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateIncompleteChallengeStreakTaskRetrieveChallengeMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIncompleteChallengeStreakTaskRetrieveChallengeMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-402`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PatchChallengeStreakRetrieveChallengeMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PatchChallengeStreakRetrieveChallengeMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-403`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendNewFollowerRequestNotificationMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendNewFollowerRequestNotificationMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-404`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PatchCurrentUserPushNotificationsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PatchCurrentUserPushNotificationsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-405`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendUpdatedCurrentUserPushNotificationsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendUpdatedCurrentUserPushNotificationsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-406`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DisableTeamMembersRemindersWhenTeamStreakIsArchivedMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DisableTeamMembersRemindersWhenTeamStreakIsArchivedMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-407`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DisableSoloStreakReminderWhenSoloStreakIsArchivedMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DisableSoloStreakReminderWhenSoloStreakIsArchivedMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-408`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DisableChallengeStreakReminderWhenChallengeStreakIsArchivedMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.DisableChallengeStreakReminderWhenChallengeStreakIsArchivedMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-409`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CalculateTotalChallengesCountMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CalculateTotalChallengesCountMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-410`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FindChallengesMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FindChallengesMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-411`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FormAchievementsQueryMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FormAchievementsQueryMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-412`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CalculateTotalCountOfAchievementsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CalculateTotalCountOfAchievementsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-413`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FindAchievementsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FindAchievementsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-414`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendAchievementsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendAchievementsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-415`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SaveAchievementToDatabaseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SaveAchievementToDatabaseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-416`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendAchievementMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendAchievementMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-417`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to UnlockOneHundredDaySoloStreakAchievementForUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UnlockOneHundredDaySoloStreakAchievementForUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-418`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PopulateUserAchievementMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PopulateUserAchievementMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-419`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PopulateCurrentUserAchievementsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PopulateCurrentUserAchievementsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-420`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PopulatePatchCurrentUserAchievementsMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PopulatePatchCurrentUserAchievementsMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-421`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendOneHundredDaySoloStreakAchievementUnlockedPushNotificationMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.SendOneHundredDaySoloStreakAchievementUnlockedPushNotificationMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-422`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CompleteSoloStreakTaskIncreaseTotalStreakCompletesForUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.CompleteSoloStreakTaskIncreaseTotalStreakCompletesForUserMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-423`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to IncompleteSoloStreakTaskDecreaseTotalStreakCompletesForUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.IncompleteSoloStreakTaskDecreaseTotalStreakCompletesForUserMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-424`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CompleteChallengeStreakTaskIncreaseTotalStreakCompletesForUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.CompleteChallengeStreakTaskIncreaseTotalStreakCompletesForUserMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-425`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to IncompleteChallengeStreakTaskDecreaseTotalStreakCompletesForUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.IncompleteChallengeStreakTaskDecreaseTotalStreakCompletesForUserMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-426`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CompleteTeamMemberStreakTaskIncreaseTotalStreakCompletesForUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.CompleteTeamMemberStreakTaskIncreaseTotalStreakCompletesForUserMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-427`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to IncompleteTeamMemberStreakTaskDecreaseTotalStreakCompletesForUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.IncompleteTeamMemberStreakTaskDecreaseTotalStreakCompletesForUserMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-428`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateSoloStreakIncreaseUsersTotalLiveStreaksByOneMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateSoloStreakIncreaseUsersTotalLiveStreaksByOneMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-429`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateTeamMemberStreakIncreaseUsersTotalLiveStreaksByOneMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.CreateTeamMemberStreakIncreaseUsersTotalLiveStreaksByOneMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-430`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateChallengeStreakIncreaseUsersTotalLiveStreaksByOneMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.CreateChallengeStreakIncreaseUsersTotalLiveStreaksByOneMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-431`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PatchSoloStreakDecreaseUsersTotalLiveStreaksByOneWhenStreakIsArchivedMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.PatchSoloStreakDecreaseUsersTotalLiveStreaksByOneWhenStreakIsArchivedMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-432`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to decreaseTeamMembersTotalLiveStreaksByOneWhenStreakIsArchivedMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.DecreaseTeamMembersTotalLiveStreaksByOneWhenStreakIsArchivedMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-433`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PatchChallengeStreakDecreaseUsersTotalLiveStreaksByOneWhenStreakIsArchivedMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.PatchChallengeStreakDecreaseUsersTotalLiveStreaksByOneWhenStreakIsArchivedMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-434`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PatchSoloStreakIncreaseUsersTotalLiveStreaksByOneWhenStreakIsRestoredMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.PatchSoloStreakIncreaseUsersTotalLiveStreaksByOneWhenStreakIsRestoredMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-435`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to IncreaseTeamMembersTotalLiveStreaksByOneWhenStreakIsRestoredMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.IncreaseTeamMembersTotalLiveStreaksByOneWhenStreakIsRestoredMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-436`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PatchChallengeStreakIncreaseUsersTotalLiveStreaksByOneWhenStreakIsRestoredMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.PatchChallengeStreakIncreaseUsersTotalLiveStreaksByOneWhenStreakIsRestoredMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-437`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to IncreaseTeamStreakMembersTotalLiveStreaksByOneMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.IncreaseTeamStreakMembersTotalLiveStreaksByOneMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-438`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SaveTemporaryUserToDatabaseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SaveTemporaryUserToDatabaseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-439`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RegisterTemporaryUserFormatUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RegisterTemporaryUserFormatUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-440`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RegisterTemporaryUserFormatUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendFormattedTemporaryUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-441`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DoesUserIdentifierExistMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DoesUserIdentifierExistMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-442`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PatchCurrentUserDoesUserEmailExistMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PatchCurrentUserDoesUserEmailExistMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-443`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PatchCurrentUserDoesUsernameAlreadyExistMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PatchCurrentUserDoesUsernameAlreadyExistMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-444`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GenerateRandomUsernameMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GenerateRandomUsernameMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-445`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GenerateTemporaryPasswordMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GenerateTemporaryPasswordMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-446`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to AwsCognitoSignUpMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.AwsCognitoSignUpMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-447`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to UpdateAwsCognitoEmailMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UpdateAwsCognitoEmailMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-448`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to UpdateAwsCognitoUsernameMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UpdateAwsCognitoUsernameMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-449`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to PreventExistingTeamMembersFromBeingAddedToTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.PreventExistingTeamMembersFromBeingAddedToTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-450`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to UnlockOneHundredDayChallengeStreakAchievementForUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UnlockOneHundredDayChallengeStreakAchievementForUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-451`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RemoveOldAndroidEndpointArnWhenPushNotificationIsUpdatedMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.RemoveOldAndroidEndpointArnWhenPushNotificationIsUpdatedMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-452`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RemoveOldIosEndpointArnWhenPushNotificationIsUpdatedMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RemoveOldIosEndpointArnWhenPushNotificationIsUpdatedMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-453`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateAndroidPlatformEndpointMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateAndroidPlatformEndpointMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-454`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateIosPlatformEndpointMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateIosPlatformEndpointMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-455`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendOneHundredDayChallengeStreakAchievementUnlockedPushNotificationMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.SendOneHundredDayChallengeStreakAchievementUnlockedPushNotificationMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-456`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to AddInviteKeyToTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.AddInviteKeyToTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-457`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to KeepInviteLinkIfUserIsApartOfTeamStreak`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.KeepInviteLinkIfUserIsApartOfTeamStreak);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-458`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GetTeamStreakInviteRetrieveTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetTeamStreakInviteRetrieveTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-459`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendTeamStreakInviteKeyMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendTeamStreakInviteKeyMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-460`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FormatTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FormatTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-461`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FormatTeamStreaksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FormatTeamStreaksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-462`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateTeamStreakFormatTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateTeamStreakFormatTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-463`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateTeamStreakFormatTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateTeamStreakFormatTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-463`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreditCoinsToUserForCompletingSoloStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreditCoinsToUserForCompletingSoloStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-464`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreditOidXpToUserForCompletingSoloStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreditOidXpToUserForCompletingSoloStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-465`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to NotifyOtherTeamMembersAboutNewTeamMemberMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.NotifyOtherTeamMembersAboutNewTeamMemberMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-466`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to IncreaseTotalTimesTrackedForSoloStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.IncreaseTotalTimesTrackedForSoloStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-467`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DecreaseTotalTimesTrackedForSoloStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DecreaseTotalTimesTrackedForSoloStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-468`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to ChargeCoinsToUserForIncompletingSoloStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ChargeCoinsToUserForIncompletingSoloStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-469`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to ChargeOidXpToUserForIncompletingSoloStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ChargeOidXpToUserForIncompletingSoloStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-470`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to IncreaseTotalTimesTrackedForChallengeStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.IncreaseTotalTimesTrackedForChallengeStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-471`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreditCoinsToUserForCompletingChallengeStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreditCoinsToUserForCompletingChallengeStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-472`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreditOidXpToUserForCompletingChallengeStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreditOidXpToUserForCompletingChallengeStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-473`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DecreaseTotalTimesTrackedForChallengeStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DecreaseTotalTimesTrackedForChallengeStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-474`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to ChargeCoinsToUserForIncompletingChallengeStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ChargeCoinsToUserForIncompletingChallengeStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-475`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to ChargeOidXpToUserForIncompletingChallengeStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ChargeOidXpToUserForIncompletingChallengeStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-476`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to IncreaseTotalTimesTrackedForTeamMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.IncreaseTotalTimesTrackedForTeamMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-477`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreditCoinsToUserForCompletingTeamMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreditCoinsToUserForCompletingTeamMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-478`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreditOidXpToUserForCompletingTeamMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreditOidXpToUserForCompletingTeamMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-479`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DecreaseTotalTimesTrackedForTeamMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DecreaseTotalTimesTrackedForTeamMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-480`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to ChargeCoinsToUserForIncompletingTeamMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ChargeCoinsToUserForIncompletingTeamMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-481`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to ChargeOidXpToUserForIncompletingTeamMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ChargeOidXpToUserForIncompletingTeamMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-482`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetreiveChallengeStreakToRecoverMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveChallengeStreakToRecoverMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-483`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to ReplaceChallengeStreakCurrentStreakWithLostStreak`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ReplaceChallengeStreakCurrentStreakWithLostStreak);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-484`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendRecoveredChallengeStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendRecoveredChallengeStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-485`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetreiveSoloStreakToRecoverMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveSoloStreakToRecoverMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-486`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to ReplaceSoloStreakCurrentStreakWithLostStreak`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ReplaceSoloStreakCurrentStreakWithLostStreak);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-487`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendRecoveredSoloStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendRecoveredSoloStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-488`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateRecoveredChallengeStreakActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateRecoveredChallengeStreakActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-489`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateRecoveredChallengeStreakTrackingEventMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateRecoveredChallengeStreakTrackingEventMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-490`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateRecoveredSoloStreakActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateRecoveredSoloStreakActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-491`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateRecoveredSoloStreakTrackingEventMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateRecoveredSoloStreakTrackingEventMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-492`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateACompleteChallengeStreakTaskForPreviousDayMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateACompleteChallengeStreakTaskForPreviousDayMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-493`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateACompleteSoloStreakTaskForPreviousDayMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateACompleteSoloStreakTaskForPreviousDayMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-494`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to IncreaseTotalTimesTrackedForTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.IncreaseTotalTimesTrackedForTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-495`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DecreaseTotalTimesTrackedForTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DecreaseTotalTimesTrackedForTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-496`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CheckCurrentUserIsPartOfTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CheckCurrentUserIsPartOfTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-497`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to ChargeUserCoinsToRecoverChallengeStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ChargeUserCoinsToRecoverChallengeStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-498`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to ChargeUserCoinsToRecoverSoloStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ChargeUserCoinsToRecoverSoloStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-499`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetreiveTeamMemberStreakToRecoverMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetreiveTeamMemberStreakToRecoverMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-504`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetrieveTeamStreakToRecoverMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveTeamStreakToRecoverMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-505`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to ChargeUserCoinsToRecoverTeamMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ChargeUserCoinsToRecoverTeamMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-506`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RecoverTeamMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RecoverTeamMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-507`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to ShouldTeamStreakBeRecoveredMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ShouldTeamStreakBeRecoveredMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-508`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RecoverTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RecoverTeamStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-509`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateACompleteTeamMemberStreakTaskForPreviousDayMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateACompleteTeamMemberStreakTaskForPreviousDayMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-510`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateRecoveredTeamMemberStreakActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateRecoveredTeamMemberStreakActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-511`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateRecoveredTeamMemberStreakTrackingEventMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateRecoveredTeamMemberStreakTrackingEventMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-512`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendRecoveredTeamMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendRecoveredTeamMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-513`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateRecoveredTeamStreakActivityFeedItemMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateRecoveredTeamStreakActivityFeedItemMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-514`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateRecoveredTeamStreakTrackingEventMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateRecoveredTeamStreakTrackingEventMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-515`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RecoverTeamMemberStreakIncreaseTotalStreakCompletesForUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.RecoverTeamMemberStreakIncreaseTotalStreakCompletesForUserMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-516`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RecoverTeamMemberStreakIncreaseLongestTeamMemberStreakForUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.RecoverTeamMemberStreakIncreaseLongestTeamMemberStreakForUserMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-519`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RecoverTeamMemberStreakIncreaseLongestTeamMemberStreakForTeamMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.RecoverTeamMemberStreakIncreaseLongestTeamMemberStreakForTeamMemberStreakMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-520`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RecoverTeamMemberStreakIncreaseLongestTeamStreakForMembersMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.RecoverTeamMemberStreakIncreaseLongestTeamStreakForMembersMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-521`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RecoverTeamStreakIncreaseLongestTeamStreakForTeamStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.RecoverTeamStreakIncreaseLongestTeamStreakForTeamStreakMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-522`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to IncreaseTotalStreakCompletesForUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.IncreaseTotalStreakCompletesForUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-523`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RecoverSoloStreakIncreaseLongestSoloStreakForUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RecoverSoloStreakIncreaseLongestSoloStreakForUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-524`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RecoverSoloStreakIncreaseLongestSoloStreakForSoloStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.RecoverSoloStreakIncreaseLongestSoloStreakForSoloStreakMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-525`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RecoverChallengeStreakIncreaseTotalStreakCompletesForUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.RecoverChallengeStreakIncreaseTotalStreakCompletesForUserMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-526`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RecoverChallengeStreakIncreaseLongestChallengeStreakForUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.RecoverChallengeStreakIncreaseLongestChallengeStreakForUserMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-527`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RecoverChallengeStreakIncreaseLongestChallengeStreakForChallengeStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.RecoverChallengeStreakIncreaseLongestChallengeStreakForChallengeStreakMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-528`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RecoverChallengeStreakRetreiveChallengeMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RecoverChallengeStreakRetreiveChallengeMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-529`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to DeleteTeamMemberRetrieveTeamMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.DeleteTeamMemberRetrieveTeamMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-530`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to ArchiveTeamMemberStreakMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.ArchiveTeamMemberStreakMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-531`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to UnlockOneHundredDayTeamMemberStreakAchievementForUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UnlockOneHundredDayTeamMemberStreakAchievementForUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-532`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendOneHundredDayTeamMemberStreakAchievementUnlockedPushNotificationMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(
            ErrorType.SendOneHundredDayTeamMemberStreakAchievementUnlockedPushNotificationMiddleware,
        );
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-533`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to CreateStripePortalSessionMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateStripePortalSessionMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-534`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendStripePortalSessionMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendStripePortalSessionMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-535`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to IsUserAStripeCustomerMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.IsUserAStripeCustomerMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-536`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FindSoloStreaksForCurrentUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FindSoloStreaksForCurrentUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-537`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendSoloStreaksForCurrentUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendSoloStreaksForCurrentUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-538`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to GetCurrentUserChallengeStreaksMiddlewares`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetCurrentUserChallengeStreaksMiddlewares);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-539`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendCurrentUserChallengeStreaksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendCurrentUserChallengeStreaksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-540`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FindCurrentUserTeamMemberStreaksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FindCurrentUserTeamMemberStreaksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-541`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendCurrentUserTeamMemberStreaksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendCurrentUserTeamMemberStreaksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-542`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FindCurrentUserTeamStreaksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FindCurrentUserTeamStreaksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-543`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetrieveCurrentUserTeamStreaksMembersInformation`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveCurrentUserTeamStreaksMembersInformation);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-544`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to FormatCurrentUserTeamStreaksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.FormatCurrentUserTeamStreaksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-545`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendCurrentUserTeamStreaksMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendCurrentUserTeamStreaksMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-546`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to UpdateTeamStreakTeamMemberStreaksNamesMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UpdateTeamStreakTeamMemberStreaksNamesMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-547`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to UpdateTeamStreakTeamMemberStreaksVisibilityMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UpdateTeamStreakTeamMemberStreaksVisibilityMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-548`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to UpdateTeamStreakTeamMemberStreaksStatusMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UpdateTeamStreakTeamMemberStreaksStatusMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-549`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });
});
