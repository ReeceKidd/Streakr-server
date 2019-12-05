/* eslint-disable */
import { ResponseCodes } from './Server/responseCodes';

export enum ErrorType {
    InternalServerError,
    InvalidTimezone,
    AddStripeSubscriptionToUserMiddleware,
    UserDoesNotExist,
    PasswordDoesNotMatchHash,
    RetreiveUserWithEmailMiddlewareError,
    CompareRequestPasswordToUserHashedPasswordMiddleware,
    SetMinimumUserDataMiddleware,
    SetJsonWebTokenExpiryInfoMiddleware,
    SetJsonWebTokenMiddleware,
    LoginSuccessfulMiddleware,
    SoloStreakDoesNotExist,
    SoloStreakExistsMiddleware,
    MissingTimezoneHeader,
    RetreiveTimezoneHeaderMiddleware,
    ValidateTimezoneMiddleware,
    RetreiveUserMiddleware,
    SetTaskCompleteTimeMiddleware,
    SetStreakStartDateMiddleware,
    SoloStreakHasBeenCompletedToday,
    HasTaskAlreadyBeenCompletedTodayMiddleware,
    CreateCompleteSoloStreakTaskDefinitionMiddleware,
    SaveTaskCompleteMiddleware,
    StreakMaintainedMiddleware,
    SendTaskCompleteResponseMiddleware,
    SetDayTaskWasCompletedMiddleware,
    DefineCurrentTimeMiddleware,
    DefineStartDayMiddleware,
    DefineEndOfDayMiddleware,
    CreateSoloStreakFromRequestMiddleware,
    SaveSoloStreakToDatabaseMiddleware,
    SendFormattedSoloStreakMiddleware,
    NoSoloStreakToDeleteFound,
    DeleteSoloStreakMiddleware,
    SendSoloStreakDeletedResponseMiddleware,
    GetSoloStreakNoSoloStreakFound,
    RetreiveSoloStreakMiddleware,
    SendSoloStreakMiddleware,
    FindSoloStreaksMiddleware,
    SendSoloStreaksMiddleware,
    UpdatedSoloStreakNotFound,
    PatchSoloStreakMiddleware,
    SendUpdatedSoloStreakMiddleware,
    SetSearchQueryToLowercaseMiddleware,
    RetreiveUsersMiddleware,
    FormatUsersMiddleware,
    SendUsersMiddleware,
    UserEmailAlreadyExists,
    DoesUserEmailExistMiddleware,
    SetUsernameToLowercaseMiddleware,
    UsernameAlreadyExists,
    DoesUsernameAlreadyExistMiddleware,
    HashPasswordMiddleware,
    SaveUserToDatabaseMiddleware,
    SendFormattedUserMiddleware,
    CreateStripeCustomerMiddleware,
    CreateStripeSubscriptionMiddleware,
    HandleInitialPaymentOutcomeMiddleware,
    SendSuccessfulSubscriptionMiddleware,
    IncompletePayment,
    UnknownPaymentStatus,
    IsUserAnExistingStripeCustomerMiddleware,
    CustomerIsAlreadySubscribed,
    CreateStripeSubscriptionUserDoesNotExist,
    CancelStripeSubscriptionUserDoesNotExist,
    CustomerIsNotSubscribed,
    DoesUserHaveStripeSubscriptionMiddleware,
    CancelStripeSubscriptionMiddleware,
    RemoveSubscriptionFromUserMiddleware,
    SendSuccessfullyRemovedSubscriptionMiddleware,
    UpdateUserMembershipInformationMiddleware,
    SetUserTypeToBasicMiddleware,
    NoUserToDeleteFound,
    DeleteUserMiddleware,
    SendUserDeletedResponseMiddleware,
    GetCompleteSoloStreakTasksMiddleware,
    SendCompleteSoloStreakTasksResponseMiddleware,
    NoCompleteSoloStreakTaskToDeleteFound,
    DeleteCompleteSoloStreakTaskMiddleware,
    SendCompleteSoloStreakTaskDeletedResponseMiddleware,
    NoUserFound,
    GetRetreiveUserMiddleware,
    SendUserMiddleware,
    RetreiveIncompleteSoloStreaksMiddleware,
    RetreiveFriendsMiddleware,
    SendFormattedFriendsMiddleware,
    AddFriendUserDoesNotExist,
    AddFriendRetreiveUserMiddleware,
    FriendDoesNotExist,
    DoesFriendExistMiddleware,
    AddFriendToUsersFriendListMiddleware,
    SendUserWithNewFriendMiddleware,
    IsAlreadyAFriend,
    IsAlreadyAFriendMiddleware,
    DeleteUserNoUserFound,
    DeleteUserRetreiveUserMiddleware,
    DeleteFriendDoesFriendExistMiddleware,
    DeleteFriendMiddleware,
    DeleteUserFriendDoesNotExist,
    GetFriendsUserDoesNotExist,
    GetFriendsRetreiveUserMiddleware,
    FormatFriendsMiddleware,
    TeamStreakDefineCurrentTimeMiddleware,
    TeamStreakDefineStartDayMiddleware,
    TeamStreakDefineEndOfDayMiddleware,
    CreateTeamStreakMiddleware,
    SaveTeamStreakToDatabaseMiddleware,
    SendFormattedTeamStreakMiddleware,
    FindTeamStreaksMiddleware,
    SendTeamStreaksMiddleware,
    RetreiveTeamStreaksMembersInformation,
    SendTeamStreakDeletedResponseMiddleware,
    DeleteTeamStreakMiddleware,
    NoTeamStreakToDeleteFound,
    GetTeamStreakNoTeamStreakFound,
    RetreiveTeamStreakMiddleware,
    SendTeamStreakMiddleware,
    RetreiveTeamStreakMembersInformation,
    CreateStreakTrackingEventFromRequestMiddleware,
    SaveStreakTrackingEventToDatabaseMiddleware,
    SendFormattedStreakTrackingEventMiddleware,
    GetStreakTrackingEventsMiddleware,
    SendStreakTrackingEventsResponseMiddleware,
    GetStreakTrackingEventNoStreakTrackingEventFound,
    RetreiveStreakTrackingEventMiddleware,
    SendStreakTrackingEventMiddleware,
    NoStreakTrackingEventToDeleteFound,
    DeleteStreakTrackingEventMiddleware,
    SendStreakTrackingEventDeletedResponseMiddleware,
    NoAgendaJobToDeleteFound,
    DeleteAgendaJobMiddleware,
    SendAgendaJobDeletedResponseMiddleware,
    CreateFeedbackFromRequestMiddleware,
    SaveFeedbackToDatabaseMiddleware,
    SendFormattedFeedbackMiddleware,
    DeleteFeedbackMiddleware,
    SendFeedbackDeletedResponseMiddleware,
    NoFeedbackToDeleteFound,
    RetreiveTeamStreakCreatorInformationMiddleware,
    CreateTeamMemberStreakFromRequestMiddleware,
    SaveTeamMemberStreakToDatabaseMiddleware,
    SendFormattedTeamMemberStreakMiddleware,
    CreateTeamMemberStreakRetreiveUserMiddleware,
    CreateTeamMemberStreakUserDoesNotExist,
    CreateTeamMemberStreakTeamStreakDoesNotExist,
    CreateTeamMemberStreakRetreiveTeamStreakMiddleware,
    DeleteTeamMemberStreakMiddleware,
    SendTeamMemberStreakDeletedResponseMiddleware,
    NoTeamMemberStreakToDeleteFound,
    TeamMemberStreakExistsMiddleware,
    CreateCompleteTeamMemberStreakTaskRetreiveUserMiddleware,
    SetTeamMemberStreakTaskCompleteTimeMiddleware,
    SetTeamMemberStreakStartDateMiddleware,
    SetDayTeamMemberStreakTaskWasCompletedMiddleware,
    HasTeamMemberStreakTaskAlreadyBeenCompletedTodayMiddleware,
    SaveTeamMemberStreakTaskCompleteMiddleware,
    TeamMemberStreakMaintainedMiddleware,
    SendCompleteTeamMemberStreakTaskResponseMiddleware,
    TeamMemberStreakTaskHasBeenCompletedToday,
    TeamMemberStreakDoesNotExist,
    CreateCompleteTeamMemberStreakTaskDefinitionMiddleware,
    RetreiveTeamMemberStreakMiddleware,
    SendTeamMemberStreakMiddleware,
    GetTeamMemberStreakNoTeamMemberStreakFound,
    TeamStreakDoesNotExist,
    TeamStreakExistsMiddleware,
    CreateCompleteTeamMemberStreakTaskMiddleware,
    DeleteCompleteTeamMemberStreakTaskMiddleware,
    SendCompleteTeamMemberStreakTaskDeletedResponseMiddleware,
    NoCompleteTeamMemberStreakTaskToDeleteFound,
    GetCompleteTeamMemberStreakTasksMiddleware,
    SendCompleteTeamMemberStreakTasksResponseMiddleware,
    CreateTeamStreakCreateMemberStreakMiddleware,
    TeamMemberDoesNotExist,
    UpdateTeamStreakMembersArray,
    PatchTeamStreakMiddleware,
    SendUpdatedTeamStreakMiddleware,
    UpdatedTeamStreakNotFound,
    CreateTeamMemberFriendExistsMiddleware,
    CreateTeamMemberTeamStreakExistsMiddleware,
    SendCreateTeamMemberResponseMiddleware,
    CreateTeamMemberFriendDoesNotExist,
    CreateTeamMemberTeamStreakDoesNotExist,
    CreateTeamMemberCreateTeamMemberStreakMiddleware,
    AddFriendToTeamStreakMiddleware,
    DeleteTeamMemberRetreiveTeamStreakMiddleware,
    RetreiveTeamMemberMiddleware,
    DeleteTeamMemberMiddleware,
    SendTeamMemberDeletedResponseMiddleware,
    NoTeamStreakFound,
    NoTeamMemberFound,
    FindTeamMemberStreaksMiddleware,
    SendTeamMemberStreaksMiddleware,
    PatchUserMiddleware,
    SendUpdatedUserMiddleware,
    UpdatedUserNotFound,
    RetreiveRequesterMiddleware,
    RetreiveRequesteeMiddleware,
    RequesteeIsAlreadyAFriendMiddleware,
    SaveFriendRequestToDatabaseMiddleware,
    SendFriendRequestMiddleware,
    RequesterDoesNotExist,
    RequesteeDoesNotExist,
    RequesteeIsAlreadyAFriend,
    FindFriendRequestsMiddleware,
    SendFriendRequestsMiddleware,
    SendFriendRequestDeletedResponseMiddleware,
    DeleteFriendRequestMiddleware,
    NoFriendRequestToDeleteFound,
    FriendRequestDoesNotExist,
    RetreiveFriendRequestMiddleware,
    UpdateFriendRequestStatusMiddleware,
    SendUpdatedFriendRequestMiddleware,
    PatchFriendRequestMiddleware,
    UpdatedFriendRequestNotFound,
    PopulateFriendRequestsMiddleware,
    PopulateFriendRequestMiddleware,
    DefineUpdatedPopulatedFriendRequest,
    PopulateTeamStreakMembersInformation,
    RetreiveCreatedTeamStreakCreatorInformationMiddleware,
    AddUserToFriendsFriendListMiddleware,
    AddFriendToUsersFriendListNotFound,
    RetreiveFormattedRequesterDoesNotExist,
    RetreiveFormattedRequesteeDoesNotExist,
    RetreiveFormattedRequesterMiddleware,
    RetreiveFormattedRequesteeMiddleware,
    SetTaskIncompleteTimeMiddleware,
    SetDayTaskWasIncompletedMiddleware,
    CreateIncompleteSoloStreakTaskDefinitionMiddleware,
    SaveTaskIncompleteMiddleware,
    SendTaskIncompleteResponseMiddleware,
    CreateIncompleteSoloStreakTaskSoloStreakExistsMiddleware,
    CreateIncompleteSoloStreakTaskRetreiveUserMiddleware,
    IncompleteSoloStreakMiddleware,
    CreateIncompleteSoloStreakTaskSoloStreakDoesNotExist,
    CreateIncompleteSoloStreakTaskUserDoesNotExist,
    NoIncompleteSoloStreakTaskToDeleteFound,
    DeleteIncompleteSoloStreakTaskMiddleware,
    SendIncompleteSoloStreakTaskDeletedResponseMiddleware,
    GetIncompleteSoloStreakTasksMiddleware,
    SendIncompleteSoloStreakTasksResponseMiddleware,
    SoloStreakHasNotBeenCompletedToday,
    EnsureSoloStreakTaskHasBeenCompletedTodayMiddleware,
    ResetStreakStartDateMiddleware,
    EnsureSoloStreakTaskHasNotBeenCompletedTodayMiddleware,
    EnsureTeamMemberStreakTaskHasNotBeenCompletedTodayMiddleware,
    CreateIncompleteTeamMemberStreakTaskTeamMemberStreakDoesNotExist,
    TeamMemberStreakHasNotBeenCompletedToday,
    CreateIncompleteTeamMemberStreakTaskUserDoesNotExist,
    CreateIncompleteTeamMemberStreakTaskTeamMemberStreakExistsMiddleware,
    EnsureTeamMemberStreakTaskHasBeenCompletedTodayMiddleware,
    CreateIncompleteTeamMemberStreakTaskRetreiveUserMiddleware,
    CreateIncompleteTeamMemberStreakSetTaskIncompleteTimeMiddleware,
    CreateIncompleteTeamMemberStreakSetDayTaskWasIncompletedMiddleware,
    CreateIncompleteTeamMemberStreakTaskDefinitionMiddleware,
    SaveTeamMemberStreakTaskIncompleteMiddleware,
    IncompleteTeamMemberStreakMiddleware,
    SendTeamMemberStreakTaskIncompleteResponseMiddleware,
    ResetTeamMemberStreakStartDateMiddleware,
    NoIncompleteTeamMemberStreakTaskToDeleteFound,
    DeleteIncompleteTeamMemberStreakTaskMiddleware,
    SendIncompleteTeamMemberStreakTaskDeletedResponseMiddleware,
    GetIncompleteTeamMemberStreakTasksMiddleware,
    SendIncompleteTeamMemberStreakTasksResponseMiddleware,
    UpdatedTeamMemberStreakNotFound,
    PatchTeamMemberStreakMiddleware,
    SendUpdatedTeamMemberStreakMiddleware,
    TeamStreakTypeShouldNotBeDefined,
    ValidateStreakTrackingEventBody,
    TeamStreakTypeMustBeDefined,
    ValidateDailyJobBodyTeamStreakTypeShouldNotBeDefined,
    ValidateDailyJobBodyTeamStreakTypeMustBeDefined,
    ValidateDailyJobBody,
    CreateDailyJobFromRequestMiddleware,
    SendFormattedDailyJobMiddleware,
    CreateCompleteTeamStreakTeamStreakExistsMiddleware,
    EnsureTeamStreakTaskHasNotBeenCompletedTodayMiddleware,
    CreateCompleteTeamStreakRetreiveUserMiddleware,
    CreateCompleteTeamStreakSetTaskCompleteTimeMiddleware,
    CreateCompleteTeamStreakSetStreakStartDateMiddleware,
    CreateCompleteTeamStreakSetDayTaskWasCompletedMiddleware,
    CreateCompleteTeamStreakDefinitionMiddleware,
    CreateCompleteTeamStreakSaveTaskCompleteMiddleware,
    CreateCompleteTeamStreakStreakMaintainedMiddleware,
    CreateCompleteTeamStreakSendTaskCompleteResponseMiddleware,
    TeamStreakHasBeenCompletedToday,
    CreateCompleteTeamStreakTeamStreakDoesNotExist,
    CreateCompleteTeamStreakUserDoesNotExist,
    GetCompleteTeamStreaksMiddleware,
    SendCompleteTeamStreaksResponseMiddleware,
    SendCompleteTeamStreakDeletedResponseMiddleware,
    DeleteCompleteTeamStreakMiddleware,
    NoCompleteTeamStreakToDeleteFound,
    TokenDoesNotExist,
    DecodeJWTMiddleware,
    AuthUserDoesNotExist,
    AuthRetreiveUserMiddleware,
    AuthInvalidTokenNoCognitoUsername,
    AudienceDoesNotMatchCognitoAppClientId,
    EnsureAudienceMatchesCognitoUserPool,
    MakeTeamStreakActive,
    CompleteTeamMemberStreakTaskTeamMemberStreakDoesNotExist,
    HaveAllTeamMembersCompletedTasksMiddlewares,
    SetTeamStreakToActive,
    FindDailyJobsMiddleware,
    SendDailyJobsMiddleware,
    FormatUserMiddleware,
    FormatUpdatedUserMiddleware,
    EmailSentResponseMiddleware,
    SaveEmailToDatabaseMiddleware,
    CreateEmailFromRequestMiddleware,
    SendEmailMiddleware,
    FriendRequestAlreadySent,
    HasRequesterAlreadySentInvite,
    StripeTokenMissingId,
    StripeTokenMissingEmail,
    ValidateStripeTokenMiddlware,
    ImageTypeValidationMiddleware,
    InvalidImageFormat,
    ManipulateProfilePictureMiddleware,
    NoImageInRequest,
    GetSingleImageUploadMiddleware,
    S3UploadAvatarImage,
    S3UploadOriginalImage,
    DefineProfilePictures,
    SetUserProfilePictures,
    SendProfilePictures,
    GetFriendsInfoMiddleware,
    DeleteFriendRetreiveFriendMiddleware,
    DeleteUserFromFriendsFriendListMiddleware,
    DeleteFriendNoFriendFound,
    GetIncompleteTeamStreaksMiddleware,
    SendIncompleteTeamStreaksResponseMiddleware,
    CreateIncompleteTeamMemberStreakTaskTeamStreakExistsMiddleware,
    ResetTeamStreakStartDateMiddleware,
    IncompleteTeamStreakMiddleware,
    CreateTeamStreakIncomplete,
    CreateIncompleteTeamMemberStreakTaskTeamStreakDoesNotExist,
    HasOneTeamMemberCompletedTaskMiddleware,
    MakeTeamStreakInactiveMiddleware,
    IncompleteTeamMemberStreakTaskTeamMemberStreakDoesNotExist,
    HasUserPaidMembershipMiddleware,
    UserHasNotPaidMembership,
    RegisterDeviceForPushNotificationRetreiveUserMiddleware,
    CreatePlatformEndpointMiddleware,
    SendSuccessfullyRegisteredDevice,
    RegisterDeviceForPushNotificationUserNotFound,
    CreateTopicSubscriptionMiddleware,
    UpdateUserPushNotificationInformationMiddleware,
    SendRequesteeAFriendRequestNotification,
    RegisterUserFormatUserMiddleware,
    CreateStripeSubscriptionFormatUserMiddleware,
    SendCurrentUserMiddleware,
    UpdateCurrentUserNotFound,
    PatchCurrentUserMiddleware,
    SendUpdatedCurrentUserMiddleware,
    GetCurrentUserFormatUserMiddleware,
    PatchCurrentUserFormatUserMiddleware,
    NotifyTeamMembersThatUserHasCompletedTaskMiddleware,
    CreateCompleteTeamMemberStreakTaskRetreiveTeamMembersMiddleware,
    CreateStreakRecommendationFromRequestMiddleware,
    SaveStreakRecommendationToDatabaseMiddleware,
    SendFormattedStreakRecommendationMiddleware,
    CreateIncompleteTeamMemberStreakTaskRetreiveTeamMembersMiddleware,
    NotifyTeamMembersThatUserHasIncompletedTaskMiddleware,
    SendStreakRecommendationsMiddleware,
    FindStreakRecommendationsMiddleware,
    FindBadgesMiddleware,
    SendBadgesMiddleware,
    CreateBadgeFromRequestMiddleware,
    SendFormattedBadgeMiddleware,
    CreateChallengeFromRequestMiddleware,
    SendFormattedChallengeMiddleware,
    FindChallengesMiddleware,
    SendChallengesMiddleware,
    GetRetreiveChallengeMiddleware,
    SendChallengeMiddleware,
    NoChallengeFound,
    CreateChallengeStreakFromRequestMiddleware,
    SendFormattedChallengeStreakMiddleware,
    FindChallengeStreaksMiddleware,
    SendChallengeStreaksMiddleware,
    RetreiveChallengeStreakMiddleware,
    SendChallengeStreakMiddleware,
    GetChallengeStreakNoChallengeStreakFound,
    ChallengeStreakExistsMiddleware,
    EnsureChallengeStreakTaskHasNotBeenCompletedTodayMiddleware,
    CreateCompleteChallengeStreakTaskRetreiveUserMiddleware,
    CreateCompleteChallengeStreakTaskSetTaskCompleteTimeMiddleware,
    CreateCompleteChallengeStreakTaskSetStreakStartDateMiddleware,
    CreateCompleteChallengeStreakTaskSetDayTaskWasCompletedMiddleware,
    CreateCompleteChallengeStreakTaskDefinitionMiddleware,
    CreateCompleteChallengeStreakTaskStreakMaintainedMiddleware,
    CreateCompleteChallengeStreakTaskSendTaskCompleteResponseMiddleware,
    CreateCompleteChallengeStreakTaskSaveTaskCompleteMiddleware,
    CreateCompleteChallengeStreakTaskUserDoesNotExist,
    ChallengeStreakDoesNotExist,
    ChallengeStreakHasBeenCompletedToday,
    CreateIncompleteChallengeStreakTaskChallengeStreakExistsMiddleware,
    EnsureChallengeStreakTaskHasBeenCompletedTodayMiddleware,
    CreateIncompleteChallengeStreakTaskRetreiveUserMiddleware,
    CreateIncompleteChallengeStreakTaskDefinitionMiddleware,
    IncompleteChallengeStreakMiddleware,
    SendChallengeTaskIncompleteResponseMiddleware,
    SaveChallengeTaskIncompleteMiddleware,
    SetDayChallengeTaskWasIncompletedMiddleware,
    SetChallengeTaskIncompleteTimeMiddleware,
    ResetChallengeStreakStartDateMiddleware,
    CreateIncompleteChallengeStreakTaskChallengeStreakDoesNotExist,
    CreateIncompleteChallengeStreakTaskUserDoesNotExist,
    ChallengeStreakHasNotBeenCompletedToday,
    PatchChallengeStreakMiddleware,
    SendUpdatedChallengeStreakMiddleware,
    UpdatedChallengeStreakNotFound,
    CreateBadgeForChallengeMiddleware,
    IsUserAlreadyInChallengeMiddleware,
    UserIsAlreadyInChallenge,
    AddUserToChallengeMiddleware,
    DoesChallengeExistMiddleware,
    CreateChallengeStreakChallengeDoesNotExist,
    CreateChallengeStreakDoesUserExistMiddleware,
    CreateChallengeStreakUserDoesNotExist,
    GetChallengeMemberInformationMiddleware,
    AddChallengeBadgeToUserBadgesMiddleware,
    PopulateUserBadgesMiddleware,
    PatchCurrentUserPopulateUserBadgesMiddleware,
    ChallengeIdIsDefinedForChallengeBadgeValidationMiddleware,
    ChallengeIdMustBeDefinedForChallengeBadge,
    GetUserPopulateUserBadgesMiddleware,
    SendNewChallengeBadgeNotificationMiddleware,
}

const internalServerMessage = 'Internal Server Error.';
const notAuthorizedErrorMessage = 'Not authorized.';

export class CustomError extends Error {
    public code: string;
    public message: string;
    public httpStatusCode: ResponseCodes;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(type: ErrorType, ...params: any[]) {
        super(...params);
        const { code, message, httpStatusCode } = this.createCustomErrorData(type);
        this.code = code;
        this.message = message;
        this.httpStatusCode = httpStatusCode;
    }

    private createCustomErrorData(type: ErrorType): { code: string; message: string; httpStatusCode: ResponseCodes } {
        switch (type) {
            case ErrorType.InvalidTimezone:
                return {
                    code: `${ResponseCodes.badRequest}-01`,
                    message: 'Timezone is invalid.',
                    httpStatusCode: ResponseCodes.badRequest,
                };

            case ErrorType.UserDoesNotExist:
                return {
                    code: `${ResponseCodes.badRequest}-02`,
                    message: 'User does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };

            case ErrorType.PasswordDoesNotMatchHash: {
                return {
                    code: `${ResponseCodes.badRequest}-03`,
                    message: 'Password does not match hash.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.SoloStreakDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-04`,
                    message: 'Solo streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.NoSoloStreakToDeleteFound: {
                return {
                    code: `${ResponseCodes.badRequest}-06`,
                    message: 'Solo streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.GetSoloStreakNoSoloStreakFound: {
                return {
                    code: `${ResponseCodes.badRequest}-07`,
                    message: 'Solo streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.UpdatedSoloStreakNotFound: {
                return {
                    code: `${ResponseCodes.badRequest}-08`,
                    message: 'Solo streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.UserEmailAlreadyExists: {
                return {
                    code: `${ResponseCodes.badRequest}-09`,
                    message: 'User email already exists.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.UsernameAlreadyExists: {
                return {
                    code: `${ResponseCodes.badRequest}-10`,
                    message: 'Username already exists.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.CreateStripeSubscriptionUserDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-11`,
                    message: 'User does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.CustomerIsAlreadySubscribed:
                return {
                    code: `${ResponseCodes.badRequest}-12`,
                    message: 'User is already subscribed.',
                    httpStatusCode: ResponseCodes.badRequest,
                };

            case ErrorType.CancelStripeSubscriptionUserDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-13`,
                    message: 'User does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.CustomerIsNotSubscribed: {
                return {
                    code: `${ResponseCodes.badRequest}-14`,
                    message: 'Customer is not subscribed.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.NoUserToDeleteFound: {
                return {
                    code: `${ResponseCodes.badRequest}-15`,
                    message: 'User does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.NoCompleteSoloStreakTaskToDeleteFound: {
                return {
                    code: `${ResponseCodes.badRequest}-16`,
                    message: 'Complete task does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.NoUserFound: {
                return {
                    code: `${ResponseCodes.badRequest}-17`,
                    message: 'User does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.AddFriendUserDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-18`,
                    message: 'User does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.FriendDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-19`,
                    message: 'Friend does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.IsAlreadyAFriend: {
                return {
                    code: `${ResponseCodes.badRequest}-20`,
                    message: 'User is already a friend.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.DeleteUserNoUserFound: {
                return {
                    code: `${ResponseCodes.badRequest}-21`,
                    message: 'User does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.DeleteUserFriendDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-22`,
                    message: 'Friend does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.GetFriendsUserDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-23`,
                    message: 'User does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.NoTeamStreakToDeleteFound: {
                return {
                    code: `${ResponseCodes.badRequest}-24`,
                    message: 'Team streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.GetTeamStreakNoTeamStreakFound: {
                return {
                    code: `${ResponseCodes.badRequest}-25`,
                    message: 'Team streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.GetStreakTrackingEventNoStreakTrackingEventFound: {
                return {
                    code: `${ResponseCodes.badRequest}-26`,
                    message: 'Streak tracking event does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.NoStreakTrackingEventToDeleteFound: {
                return {
                    code: `${ResponseCodes.badRequest}-27`,
                    message: 'Streak tracking event does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.NoAgendaJobToDeleteFound: {
                return {
                    code: `${ResponseCodes.badRequest}-28`,
                    message: 'Agenda job does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.NoFeedbackToDeleteFound: {
                return {
                    code: `${ResponseCodes.badRequest}-29`,
                    message: 'Feedback does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.CreateTeamMemberStreakUserDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-30`,
                    message: 'User does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.CreateTeamMemberStreakTeamStreakDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-31`,
                    message: 'Team streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.NoTeamMemberStreakToDeleteFound: {
                return {
                    code: `${ResponseCodes.badRequest}-32`,
                    message: 'Team member streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.TeamMemberStreakDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-33`,
                    message: 'Team member streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.GetTeamMemberStreakNoTeamMemberStreakFound: {
                return {
                    code: `${ResponseCodes.badRequest}-34`,
                    message: 'Team member streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.TeamStreakDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-35`,
                    message: 'Team streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.NoCompleteTeamMemberStreakTaskToDeleteFound: {
                return {
                    code: `${ResponseCodes.badRequest}-36`,
                    message: 'Team member streak task does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.TeamMemberDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-37`,
                    message: 'Team member does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.UpdatedTeamStreakNotFound: {
                return {
                    code: `${ResponseCodes.badRequest}-38`,
                    message: 'Team streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.CreateTeamMemberFriendDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-39`,
                    message: 'Friend does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.CreateTeamMemberTeamStreakDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-40`,
                    message: 'Team streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.NoTeamStreakFound: {
                return {
                    code: `${ResponseCodes.badRequest}-41`,
                    message: 'Team streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.NoTeamMemberFound: {
                return {
                    code: `${ResponseCodes.badRequest}-42`,
                    message: 'Team streak member does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.UpdatedUserNotFound: {
                return {
                    code: `${ResponseCodes.badRequest}-43`,
                    message: 'User does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.RequesterDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-44`,
                    message: 'Requester does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.RequesteeDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-45`,
                    message: 'Requestee does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.RequesteeIsAlreadyAFriend: {
                return {
                    code: `${ResponseCodes.badRequest}-46`,
                    message: 'Requestee is already a friend.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.NoFriendRequestToDeleteFound: {
                return {
                    code: `${ResponseCodes.badRequest}-47`,
                    message: 'No friend request to delete found.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.FriendRequestDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-48`,
                    message: 'Friend request must exist to add friend.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.UpdatedFriendRequestNotFound: {
                return {
                    code: `${ResponseCodes.badRequest}-49`,
                    message: 'Friend request does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.AddFriendToUsersFriendListNotFound: {
                return {
                    code: `${ResponseCodes.badRequest}-50`,
                    message: 'Friend does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.RetreiveFormattedRequesteeDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-51`,
                    message: 'Requestee does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.RetreiveFormattedRequesterDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-52`,
                    message: 'Requester does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.CreateIncompleteSoloStreakTaskSoloStreakDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-53`,
                    message: 'Solo streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.CreateIncompleteSoloStreakTaskUserDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-54`,
                    message: 'User does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.NoIncompleteSoloStreakTaskToDeleteFound: {
                return {
                    code: `${ResponseCodes.badRequest}-55`,
                    message: 'Complete solo streak task does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.CreateIncompleteTeamMemberStreakTaskTeamMemberStreakDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-56`,
                    message: 'Team member streak task does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.CreateIncompleteTeamMemberStreakTaskUserDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-58`,
                    message: 'User does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.NoIncompleteTeamMemberStreakTaskToDeleteFound: {
                return {
                    code: `${ResponseCodes.badRequest}-59`,
                    message: 'Team member streak task does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.UpdatedTeamMemberStreakNotFound: {
                return {
                    code: `${ResponseCodes.badRequest}-60`,
                    message: 'Team member streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.CreateCompleteTeamStreakTeamStreakDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-61`,
                    message: 'Team streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.CreateCompleteTeamStreakUserDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-62`,
                    message: 'User does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.NoCompleteTeamStreakToDeleteFound: {
                return {
                    code: `${ResponseCodes.badRequest}-63`,
                    message: 'Complete team streak task does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.CompleteTeamMemberStreakTaskTeamMemberStreakDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-64`,
                    message: 'Team member streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.FriendRequestAlreadySent: {
                return {
                    code: `${ResponseCodes.badRequest}-65`,
                    message: 'Friend request already sent.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.StripeTokenMissingId: {
                return {
                    code: `${ResponseCodes.badRequest}-66`,
                    message: 'Stripe token missing id.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.StripeTokenMissingEmail: {
                return {
                    code: `${ResponseCodes.badRequest}-67`,
                    message: 'Stripe token missing email.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.InvalidImageFormat: {
                return {
                    code: `${ResponseCodes.badRequest}-68`,
                    message: 'Invalid image format.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.NoImageInRequest: {
                return {
                    code: `${ResponseCodes.badRequest}-69`,
                    message: 'No image in request.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.DeleteFriendNoFriendFound: {
                return {
                    code: `${ResponseCodes.badRequest}-70`,
                    message: 'Friend does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.CreateIncompleteTeamMemberStreakTaskTeamStreakDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-71`,
                    message: 'Team streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.IncompleteTeamMemberStreakTaskTeamMemberStreakDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-72`,
                    message: 'Team member streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.RegisterDeviceForPushNotificationUserNotFound: {
                return {
                    code: `${ResponseCodes.badRequest}-73`,
                    message: 'User does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.UpdateCurrentUserNotFound: {
                return {
                    code: `${ResponseCodes.badRequest}-74`,
                    message: 'User does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.NoChallengeFound: {
                return {
                    code: `${ResponseCodes.badRequest}-75`,
                    message: 'Challenge does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.GetChallengeStreakNoChallengeStreakFound: {
                return {
                    code: `${ResponseCodes.badRequest}-76`,
                    message: 'Challenge streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.ChallengeStreakDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-77`,
                    message: 'Challenge streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.CreateCompleteChallengeStreakTaskUserDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-78`,
                    message: 'Challenge streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.CreateIncompleteChallengeStreakTaskChallengeStreakDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-79`,
                    message: 'Challenge streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.CreateIncompleteChallengeStreakTaskUserDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-80`,
                    message: 'Challenge streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.UpdatedChallengeStreakNotFound: {
                return {
                    code: `${ResponseCodes.badRequest}-81`,
                    message: 'Challenge streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.UserIsAlreadyInChallenge: {
                return {
                    code: `${ResponseCodes.badRequest}-82`,
                    message: 'User is already in challenge.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.CreateChallengeStreakChallengeDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-83`,
                    message: 'Challenge does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.CreateChallengeStreakUserDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-84`,
                    message: 'User does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.TokenDoesNotExist: {
                return {
                    code: `${ResponseCodes.unautohorized}-01`,
                    message: notAuthorizedErrorMessage,
                    httpStatusCode: ResponseCodes.unautohorized,
                };
            }

            case ErrorType.AuthUserDoesNotExist: {
                return {
                    code: `${ResponseCodes.unautohorized}-02`,
                    message: notAuthorizedErrorMessage,
                    httpStatusCode: ResponseCodes.unautohorized,
                };
            }

            case ErrorType.AuthInvalidTokenNoCognitoUsername: {
                return {
                    code: `${ResponseCodes.unautohorized}-03`,
                    message: notAuthorizedErrorMessage,
                    httpStatusCode: ResponseCodes.unautohorized,
                };
            }

            case ErrorType.AudienceDoesNotMatchCognitoAppClientId: {
                return {
                    code: `${ResponseCodes.unautohorized}-04`,
                    message: notAuthorizedErrorMessage,
                    httpStatusCode: ResponseCodes.unautohorized,
                };
            }

            case ErrorType.UserHasNotPaidMembership: {
                return {
                    code: `${ResponseCodes.unautohorized}-05`,
                    message: notAuthorizedErrorMessage,
                    httpStatusCode: ResponseCodes.unautohorized,
                };
            }

            case ErrorType.SoloStreakHasBeenCompletedToday: {
                return {
                    code: `${ResponseCodes.unprocessableEntity}-01`,
                    message: 'Solo streak task already completed today.',
                    httpStatusCode: ResponseCodes.unprocessableEntity,
                };
            }

            case ErrorType.SoloStreakHasNotBeenCompletedToday: {
                return {
                    code: `${ResponseCodes.unprocessableEntity}-02`,
                    message: 'Solo streak has not been completed today.',
                    httpStatusCode: ResponseCodes.unprocessableEntity,
                };
            }

            case ErrorType.TeamMemberStreakTaskHasBeenCompletedToday: {
                return {
                    code: `${ResponseCodes.unprocessableEntity}-03`,
                    message: 'Team member streak task already completed today.',
                    httpStatusCode: ResponseCodes.unprocessableEntity,
                };
            }

            case ErrorType.TeamMemberStreakHasNotBeenCompletedToday: {
                return {
                    code: `${ResponseCodes.unprocessableEntity}-04`,
                    message: 'Team member streak task has not been completed today.',
                    httpStatusCode: ResponseCodes.unprocessableEntity,
                };
            }

            case ErrorType.TeamStreakHasBeenCompletedToday: {
                return {
                    code: `${ResponseCodes.unprocessableEntity}-05`,
                    message: 'Team streak task already completed today.',
                    httpStatusCode: ResponseCodes.unprocessableEntity,
                };
            }

            case ErrorType.ChallengeStreakHasBeenCompletedToday: {
                return {
                    code: `${ResponseCodes.unprocessableEntity}-06`,
                    message: 'Challenge streak task already completed today.',
                    httpStatusCode: ResponseCodes.unprocessableEntity,
                };
            }

            case ErrorType.ChallengeStreakHasNotBeenCompletedToday: {
                return {
                    code: `${ResponseCodes.unprocessableEntity}-07`,
                    message: 'Challenge streak has not been completed today.',
                    httpStatusCode: ResponseCodes.unprocessableEntity,
                };
            }

            case ErrorType.InternalServerError:
                return {
                    code: `${ResponseCodes.warning}-01`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RetreiveUserWithEmailMiddlewareError: {
                return {
                    code: `${ResponseCodes.warning}-02`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };
            }

            case ErrorType.CompareRequestPasswordToUserHashedPasswordMiddleware: {
                return {
                    code: `${ResponseCodes.warning}-03`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };
            }

            case ErrorType.SetMinimumUserDataMiddleware: {
                return {
                    code: `${ResponseCodes.warning}-04`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };
            }

            case ErrorType.SetJsonWebTokenExpiryInfoMiddleware: {
                return {
                    code: `${ResponseCodes.warning}-05`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };
            }

            case ErrorType.SetJsonWebTokenMiddleware: {
                return {
                    code: `${ResponseCodes.warning}-06`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };
            }

            case ErrorType.LoginSuccessfulMiddleware: {
                return {
                    code: `${ResponseCodes.warning}-07`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };
            }

            case ErrorType.SoloStreakExistsMiddleware: {
                return {
                    code: `${ResponseCodes.warning}-08`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };
            }

            case ErrorType.RetreiveTimezoneHeaderMiddleware: {
                return {
                    code: `${ResponseCodes.warning}-09`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };
            }

            case ErrorType.ValidateTimezoneMiddleware: {
                return {
                    code: `${ResponseCodes.warning}-10`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };
            }

            case ErrorType.RetreiveUserMiddleware: {
                return {
                    code: `${ResponseCodes.warning}-11`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };
            }

            case ErrorType.SetTaskCompleteTimeMiddleware: {
                return {
                    code: `${ResponseCodes.warning}-12`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };
            }

            case ErrorType.SetStreakStartDateMiddleware: {
                return {
                    code: `${ResponseCodes.warning}-13`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };
            }

            case ErrorType.HasTaskAlreadyBeenCompletedTodayMiddleware: {
                return {
                    code: `${ResponseCodes.warning}-14`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };
            }

            case ErrorType.CreateCompleteSoloStreakTaskDefinitionMiddleware: {
                return {
                    code: `${ResponseCodes.warning}-15`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };
            }

            case ErrorType.SaveTaskCompleteMiddleware: {
                return {
                    code: `${ResponseCodes.warning}-16`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };
            }

            case ErrorType.StreakMaintainedMiddleware: {
                return {
                    code: `${ResponseCodes.warning}-17`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };
            }

            case ErrorType.SendTaskCompleteResponseMiddleware: {
                return {
                    code: `${ResponseCodes.warning}-18`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };
            }

            case ErrorType.SetDayTaskWasCompletedMiddleware: {
                return {
                    code: `${ResponseCodes.warning}-19`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };
            }

            case ErrorType.DefineCurrentTimeMiddleware: {
                return {
                    code: `${ResponseCodes.warning}-20`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };
            }

            case ErrorType.DefineStartDayMiddleware:
                return {
                    code: `${ResponseCodes.warning}-21`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DefineEndOfDayMiddleware:
                return {
                    code: `${ResponseCodes.warning}-22`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateSoloStreakFromRequestMiddleware:
                return {
                    code: `${ResponseCodes.warning}-23`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SaveSoloStreakToDatabaseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-24`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendFormattedSoloStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-25`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DeleteSoloStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-26`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendSoloStreakDeletedResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-27`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RetreiveSoloStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-28`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendSoloStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-29`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.FindSoloStreaksMiddleware:
                return {
                    code: `${ResponseCodes.warning}-30`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendSoloStreaksMiddleware:
                return {
                    code: `${ResponseCodes.warning}-31`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.PatchSoloStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-32`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendUpdatedSoloStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-33`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SetSearchQueryToLowercaseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-34`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RetreiveUsersMiddleware:
                return {
                    code: `${ResponseCodes.warning}-35`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.FormatUsersMiddleware:
                return {
                    code: `${ResponseCodes.warning}-36`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendUsersMiddleware:
                return {
                    code: `${ResponseCodes.warning}-37`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DoesUserEmailExistMiddleware:
                return {
                    code: `${ResponseCodes.warning}-38`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SetUsernameToLowercaseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-39`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DoesUsernameAlreadyExistMiddleware:
                return {
                    code: `${ResponseCodes.warning}-40`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.HashPasswordMiddleware:
                return {
                    code: `${ResponseCodes.warning}-41`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SaveUserToDatabaseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-42`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendFormattedUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-43`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.IsUserAnExistingStripeCustomerMiddleware:
                return {
                    code: `${ResponseCodes.warning}-44`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateStripeCustomerMiddleware:
                return {
                    code: `${ResponseCodes.warning}-45`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateStripeSubscriptionMiddleware:
                return {
                    code: `${ResponseCodes.warning}-46`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.HandleInitialPaymentOutcomeMiddleware:
                return {
                    code: `${ResponseCodes.warning}-47`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendSuccessfulSubscriptionMiddleware:
                return {
                    code: `${ResponseCodes.warning}-48`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.IncompletePayment:
                return {
                    code: `${ResponseCodes.warning}-49`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.UnknownPaymentStatus:
                return {
                    code: `${ResponseCodes.warning}-50`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.AddStripeSubscriptionToUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-51`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DoesUserHaveStripeSubscriptionMiddleware:
                return {
                    code: `${ResponseCodes.warning}-52`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CancelStripeSubscriptionMiddleware:
                return {
                    code: `${ResponseCodes.warning}-53`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RemoveSubscriptionFromUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-54`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendSuccessfullyRemovedSubscriptionMiddleware:
                return {
                    code: `${ResponseCodes.warning}-55`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.UpdateUserMembershipInformationMiddleware:
                return {
                    code: `${ResponseCodes.warning}-56`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SetUserTypeToBasicMiddleware:
                return {
                    code: `${ResponseCodes.warning}-57`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DeleteUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-58`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendUserDeletedResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-59`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.GetCompleteSoloStreakTasksMiddleware:
                return {
                    code: `${ResponseCodes.warning}-60`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendCompleteSoloStreakTasksResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-61`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DeleteCompleteSoloStreakTaskMiddleware:
                return {
                    code: `${ResponseCodes.warning}-62`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendCompleteSoloStreakTaskDeletedResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-63`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.GetRetreiveUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-64`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-65`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RetreiveIncompleteSoloStreaksMiddleware:
                return {
                    code: `${ResponseCodes.warning}-66`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RetreiveFriendsMiddleware:
                return {
                    code: `${ResponseCodes.warning}-67`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendFormattedFriendsMiddleware:
                return {
                    code: `${ResponseCodes.warning}-68`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.AddFriendRetreiveUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-69`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DoesFriendExistMiddleware:
                return {
                    code: `${ResponseCodes.warning}-70`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.AddFriendToUsersFriendListMiddleware:
                return {
                    code: `${ResponseCodes.warning}-71`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendUserWithNewFriendMiddleware:
                return {
                    code: `${ResponseCodes.warning}-72`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.IsAlreadyAFriendMiddleware:
                return {
                    code: `${ResponseCodes.warning}-73`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DeleteUserRetreiveUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-74`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DeleteFriendDoesFriendExistMiddleware:
                return {
                    code: `${ResponseCodes.warning}-75`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DeleteFriendMiddleware:
                return {
                    code: `${ResponseCodes.warning}-76`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.GetFriendsRetreiveUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-77`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.FormatFriendsMiddleware:
                return {
                    code: `${ResponseCodes.warning}-78`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.TeamStreakDefineCurrentTimeMiddleware:
                return {
                    code: `${ResponseCodes.warning}-79`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.TeamStreakDefineStartDayMiddleware:
                return {
                    code: `${ResponseCodes.warning}-80`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.TeamStreakDefineEndOfDayMiddleware:
                return {
                    code: `${ResponseCodes.warning}-81`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateTeamStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-82`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SaveTeamStreakToDatabaseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-83`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendFormattedTeamStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-84`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.FindTeamStreaksMiddleware:
                return {
                    code: `${ResponseCodes.warning}-85`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendTeamStreaksMiddleware:
                return {
                    code: `${ResponseCodes.warning}-86`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RetreiveTeamStreaksMembersInformation:
                return {
                    code: `${ResponseCodes.warning}-87`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DeleteTeamStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-88`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendTeamStreakDeletedResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-89`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RetreiveTeamStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-90`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendTeamStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-91`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RetreiveTeamStreakMembersInformation:
                return {
                    code: `${ResponseCodes.warning}-92`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateStreakTrackingEventFromRequestMiddleware:
                return {
                    code: `${ResponseCodes.warning}-93`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SaveStreakTrackingEventToDatabaseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-94`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendFormattedStreakTrackingEventMiddleware:
                return {
                    code: `${ResponseCodes.warning}-95`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.GetStreakTrackingEventsMiddleware:
                return {
                    code: `${ResponseCodes.warning}-96`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendStreakTrackingEventsResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-97`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RetreiveStreakTrackingEventMiddleware:
                return {
                    code: `${ResponseCodes.warning}-98`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendStreakTrackingEventMiddleware:
                return {
                    code: `${ResponseCodes.warning}-99`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DeleteStreakTrackingEventMiddleware:
                return {
                    code: `${ResponseCodes.warning}-100`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendStreakTrackingEventDeletedResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-101`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DeleteAgendaJobMiddleware:
                return {
                    code: `${ResponseCodes.warning}-102`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendAgendaJobDeletedResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-103`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateFeedbackFromRequestMiddleware:
                return {
                    code: `${ResponseCodes.warning}-104`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SaveFeedbackToDatabaseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-105`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendFormattedFeedbackMiddleware:
                return {
                    code: `${ResponseCodes.warning}-106`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DeleteFeedbackMiddleware:
                return {
                    code: `${ResponseCodes.warning}-107`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendFeedbackDeletedResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-108`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RetreiveTeamStreakCreatorInformationMiddleware:
                return {
                    code: `${ResponseCodes.warning}-109`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateTeamMemberStreakFromRequestMiddleware:
                return {
                    code: `${ResponseCodes.warning}-110`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SaveTeamMemberStreakToDatabaseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-111`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendFormattedTeamMemberStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-112`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateTeamMemberStreakRetreiveUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-113`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateTeamMemberStreakRetreiveTeamStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-114`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DeleteTeamMemberStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-115`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendTeamMemberStreakDeletedResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-116`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.TeamMemberStreakExistsMiddleware:
                return {
                    code: `${ResponseCodes.warning}-117`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateCompleteTeamMemberStreakTaskRetreiveUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-118`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SetTeamMemberStreakTaskCompleteTimeMiddleware:
                return {
                    code: `${ResponseCodes.warning}-119`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SetTeamMemberStreakStartDateMiddleware:
                return {
                    code: `${ResponseCodes.warning}-120`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SetDayTeamMemberStreakTaskWasCompletedMiddleware:
                return {
                    code: `${ResponseCodes.warning}-121`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.HasTeamMemberStreakTaskAlreadyBeenCompletedTodayMiddleware:
                return {
                    code: `${ResponseCodes.warning}-122`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SaveTeamMemberStreakTaskCompleteMiddleware:
                return {
                    code: `${ResponseCodes.warning}-123`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.TeamMemberStreakMaintainedMiddleware:
                return {
                    code: `${ResponseCodes.warning}-124`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendCompleteTeamMemberStreakTaskResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-125`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateCompleteTeamMemberStreakTaskDefinitionMiddleware:
                return {
                    code: `${ResponseCodes.warning}-126`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RetreiveTeamMemberStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-127`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendTeamMemberStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-128`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.TeamStreakExistsMiddleware:
                return {
                    code: `${ResponseCodes.warning}-129`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateCompleteTeamMemberStreakTaskMiddleware:
                return {
                    code: `${ResponseCodes.warning}-130`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DeleteCompleteTeamMemberStreakTaskMiddleware:
                return {
                    code: `${ResponseCodes.warning}-131`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendCompleteTeamMemberStreakTaskDeletedResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-132`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.GetCompleteTeamMemberStreakTasksMiddleware:
                return {
                    code: `${ResponseCodes.warning}-133`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendCompleteTeamMemberStreakTasksResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-134`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateTeamStreakCreateMemberStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-135`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.UpdateTeamStreakMembersArray:
                return {
                    code: `${ResponseCodes.warning}-136`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.PatchTeamStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-137`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendUpdatedTeamStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-138`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateTeamMemberFriendExistsMiddleware:
                return {
                    code: `${ResponseCodes.warning}-139`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateTeamMemberTeamStreakExistsMiddleware:
                return {
                    code: `${ResponseCodes.warning}-140`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendCreateTeamMemberResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-141`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateTeamMemberCreateTeamMemberStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-142`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.AddFriendToTeamStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-143`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DeleteTeamMemberRetreiveTeamStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-144`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RetreiveTeamMemberMiddleware:
                return {
                    code: `${ResponseCodes.warning}-145`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DeleteTeamMemberMiddleware:
                return {
                    code: `${ResponseCodes.warning}-146`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendTeamMemberDeletedResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-147`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.FindTeamMemberStreaksMiddleware:
                return {
                    code: `${ResponseCodes.warning}-148`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendTeamMemberStreaksMiddleware:
                return {
                    code: `${ResponseCodes.warning}-149`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.PatchUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-150`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendUpdatedUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-151`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RetreiveRequesterMiddleware:
                return {
                    code: `${ResponseCodes.warning}-152`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RetreiveRequesteeMiddleware:
                return {
                    code: `${ResponseCodes.warning}-153`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RequesteeIsAlreadyAFriendMiddleware:
                return {
                    code: `${ResponseCodes.warning}-154`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SaveFriendRequestToDatabaseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-155`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendFriendRequestMiddleware:
                return {
                    code: `${ResponseCodes.warning}-156`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.FindFriendRequestsMiddleware:
                return {
                    code: `${ResponseCodes.warning}-157`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendFriendRequestsMiddleware:
                return {
                    code: `${ResponseCodes.warning}-158`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DeleteFriendRequestMiddleware:
                return {
                    code: `${ResponseCodes.warning}-159`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendFriendRequestDeletedResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-160`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RetreiveFriendRequestMiddleware:
                return {
                    code: `${ResponseCodes.warning}-161`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.UpdateFriendRequestStatusMiddleware:
                return {
                    code: `${ResponseCodes.warning}-162`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.PatchFriendRequestMiddleware:
                return {
                    code: `${ResponseCodes.warning}-163`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendUpdatedFriendRequestMiddleware:
                return {
                    code: `${ResponseCodes.warning}-164`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.PopulateFriendRequestsMiddleware:
                return {
                    code: `${ResponseCodes.warning}-165`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.PopulateFriendRequestMiddleware:
                return {
                    code: `${ResponseCodes.warning}-166`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DefineUpdatedPopulatedFriendRequest:
                return {
                    code: `${ResponseCodes.warning}-167`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.PopulateTeamStreakMembersInformation:
                return {
                    code: `${ResponseCodes.warning}-168`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RetreiveCreatedTeamStreakCreatorInformationMiddleware:
                return {
                    code: `${ResponseCodes.warning}-169`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.AddUserToFriendsFriendListMiddleware:
                return {
                    code: `${ResponseCodes.warning}-170`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RetreiveFormattedRequesterMiddleware:
                return {
                    code: `${ResponseCodes.warning}-171`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RetreiveFormattedRequesteeMiddleware:
                return {
                    code: `${ResponseCodes.warning}-172`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SetTaskIncompleteTimeMiddleware:
                return {
                    code: `${ResponseCodes.warning}-173`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SetDayTaskWasIncompletedMiddleware:
                return {
                    code: `${ResponseCodes.warning}-174`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateIncompleteSoloStreakTaskDefinitionMiddleware:
                return {
                    code: `${ResponseCodes.warning}-175`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SaveTaskIncompleteMiddleware:
                return {
                    code: `${ResponseCodes.warning}-176`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendTaskIncompleteResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-177`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateIncompleteSoloStreakTaskSoloStreakExistsMiddleware:
                return {
                    code: `${ResponseCodes.warning}-178`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateIncompleteSoloStreakTaskRetreiveUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-179`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.IncompleteSoloStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-180`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DeleteIncompleteSoloStreakTaskMiddleware:
                return {
                    code: `${ResponseCodes.warning}-181`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendIncompleteSoloStreakTaskDeletedResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-182`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.GetIncompleteSoloStreakTasksMiddleware:
                return {
                    code: `${ResponseCodes.warning}-183`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendIncompleteSoloStreakTasksResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-184`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.EnsureSoloStreakTaskHasBeenCompletedTodayMiddleware:
                return {
                    code: `${ResponseCodes.warning}-185`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.ResetStreakStartDateMiddleware:
                return {
                    code: `${ResponseCodes.warning}-186`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.EnsureSoloStreakTaskHasNotBeenCompletedTodayMiddleware:
                return {
                    code: `${ResponseCodes.warning}-187`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.EnsureTeamMemberStreakTaskHasNotBeenCompletedTodayMiddleware:
                return {
                    code: `${ResponseCodes.warning}-188`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateIncompleteTeamMemberStreakTaskTeamMemberStreakExistsMiddleware:
                return {
                    code: `${ResponseCodes.warning}-189`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.EnsureTeamMemberStreakTaskHasBeenCompletedTodayMiddleware:
                return {
                    code: `${ResponseCodes.warning}-190`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateIncompleteTeamMemberStreakTaskRetreiveUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-191`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateIncompleteTeamMemberStreakSetTaskIncompleteTimeMiddleware:
                return {
                    code: `${ResponseCodes.warning}-192`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateIncompleteTeamMemberStreakSetDayTaskWasIncompletedMiddleware:
                return {
                    code: `${ResponseCodes.warning}-193`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateIncompleteTeamMemberStreakTaskDefinitionMiddleware:
                return {
                    code: `${ResponseCodes.warning}-194`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SaveTeamMemberStreakTaskIncompleteMiddleware:
                return {
                    code: `${ResponseCodes.warning}-195`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.IncompleteTeamMemberStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-196`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendTeamMemberStreakTaskIncompleteResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-197`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.ResetTeamMemberStreakStartDateMiddleware:
                return {
                    code: `${ResponseCodes.warning}-198`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DeleteIncompleteTeamMemberStreakTaskMiddleware:
                return {
                    code: `${ResponseCodes.warning}-199`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendIncompleteTeamMemberStreakTaskDeletedResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-200`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.GetIncompleteTeamMemberStreakTasksMiddleware:
                return {
                    code: `${ResponseCodes.warning}-201`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendIncompleteTeamMemberStreakTasksResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-202`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.PatchTeamMemberStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-203`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendUpdatedTeamMemberStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-204`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.ValidateStreakTrackingEventBody:
                return {
                    code: `${ResponseCodes.warning}-205`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.ValidateDailyJobBody:
                return {
                    code: `${ResponseCodes.warning}-206`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateDailyJobFromRequestMiddleware:
                return {
                    code: `${ResponseCodes.warning}-207`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendFormattedDailyJobMiddleware:
                return {
                    code: `${ResponseCodes.warning}-208`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateCompleteTeamStreakTeamStreakExistsMiddleware:
                return {
                    code: `${ResponseCodes.warning}-209`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.EnsureTeamStreakTaskHasNotBeenCompletedTodayMiddleware:
                return {
                    code: `${ResponseCodes.warning}-210`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateCompleteTeamStreakRetreiveUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-211`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateCompleteTeamStreakSetTaskCompleteTimeMiddleware:
                return {
                    code: `${ResponseCodes.warning}-212`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateCompleteTeamStreakSetStreakStartDateMiddleware:
                return {
                    code: `${ResponseCodes.warning}-213`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateCompleteTeamStreakSetDayTaskWasCompletedMiddleware:
                return {
                    code: `${ResponseCodes.warning}-214`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateCompleteTeamStreakDefinitionMiddleware:
                return {
                    code: `${ResponseCodes.warning}-215`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateCompleteTeamStreakSaveTaskCompleteMiddleware:
                return {
                    code: `${ResponseCodes.warning}-216`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateCompleteTeamStreakStreakMaintainedMiddleware:
                return {
                    code: `${ResponseCodes.warning}-217`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateCompleteTeamStreakSendTaskCompleteResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-218`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.GetCompleteTeamStreaksMiddleware:
                return {
                    code: `${ResponseCodes.warning}-219`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendCompleteTeamStreaksResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-220`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DeleteCompleteTeamStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-221`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendCompleteTeamStreakDeletedResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-222`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DecodeJWTMiddleware:
                return {
                    code: `${ResponseCodes.warning}-223`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.AuthRetreiveUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-224`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.EnsureAudienceMatchesCognitoUserPool:
                return {
                    code: `${ResponseCodes.warning}-225`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.MakeTeamStreakActive:
                return {
                    code: `${ResponseCodes.warning}-226`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.HaveAllTeamMembersCompletedTasksMiddlewares:
                return {
                    code: `${ResponseCodes.warning}-227`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SetTeamStreakToActive:
                return {
                    code: `${ResponseCodes.warning}-228`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.FindDailyJobsMiddleware:
                return {
                    code: `${ResponseCodes.warning}-229`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendDailyJobsMiddleware:
                return {
                    code: `${ResponseCodes.warning}-230`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.FormatUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-231`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.FormatUpdatedUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-232`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateEmailFromRequestMiddleware:
                return {
                    code: `${ResponseCodes.warning}-233`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SaveEmailToDatabaseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-234`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.EmailSentResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-235`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendEmailMiddleware:
                return {
                    code: `${ResponseCodes.warning}-236`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.HasRequesterAlreadySentInvite:
                return {
                    code: `${ResponseCodes.warning}-237`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.ValidateStripeTokenMiddlware:
                return {
                    code: `${ResponseCodes.warning}-238`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.ImageTypeValidationMiddleware:
                return {
                    code: `${ResponseCodes.warning}-239`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.ManipulateProfilePictureMiddleware:
                return {
                    code: `${ResponseCodes.warning}-240`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.GetSingleImageUploadMiddleware:
                return {
                    code: `${ResponseCodes.warning}-241`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.S3UploadAvatarImage:
                return {
                    code: `${ResponseCodes.warning}-242`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.S3UploadOriginalImage:
                return {
                    code: `${ResponseCodes.warning}-243`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DefineProfilePictures:
                return {
                    code: `${ResponseCodes.warning}-244`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SetUserProfilePictures:
                return {
                    code: `${ResponseCodes.warning}-245`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendProfilePictures:
                return {
                    code: `${ResponseCodes.warning}-246`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.GetFriendsInfoMiddleware:
                return {
                    code: `${ResponseCodes.warning}-247`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DeleteFriendRetreiveFriendMiddleware:
                return {
                    code: `${ResponseCodes.warning}-248`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DeleteUserFromFriendsFriendListMiddleware:
                return {
                    code: `${ResponseCodes.warning}-249`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.GetIncompleteTeamStreaksMiddleware:
                return {
                    code: `${ResponseCodes.warning}-250`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendIncompleteTeamStreaksResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-251`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateIncompleteTeamMemberStreakTaskTeamStreakExistsMiddleware:
                return {
                    code: `${ResponseCodes.warning}-252`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.ResetTeamStreakStartDateMiddleware:
                return {
                    code: `${ResponseCodes.warning}-253`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.IncompleteTeamStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-254`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateTeamStreakIncomplete:
                return {
                    code: `${ResponseCodes.warning}-255`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.HasOneTeamMemberCompletedTaskMiddleware:
                return {
                    code: `${ResponseCodes.warning}-256`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.MakeTeamStreakInactiveMiddleware:
                return {
                    code: `${ResponseCodes.warning}-257`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.HasUserPaidMembershipMiddleware:
                return {
                    code: `${ResponseCodes.warning}-258`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RegisterDeviceForPushNotificationRetreiveUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-259`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreatePlatformEndpointMiddleware:
                return {
                    code: `${ResponseCodes.warning}-260`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendSuccessfullyRegisteredDevice:
                return {
                    code: `${ResponseCodes.warning}-261`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateTopicSubscriptionMiddleware:
                return {
                    code: `${ResponseCodes.warning}-262`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.UpdateUserPushNotificationInformationMiddleware:
                return {
                    code: `${ResponseCodes.warning}-263`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendRequesteeAFriendRequestNotification:
                return {
                    code: `${ResponseCodes.warning}-264`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RegisterUserFormatUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-265`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateStripeSubscriptionFormatUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-266`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendCurrentUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-267`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.PatchCurrentUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-268`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendUpdatedCurrentUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-269`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.GetCurrentUserFormatUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-270`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.PatchCurrentUserFormatUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-271`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.NotifyTeamMembersThatUserHasCompletedTaskMiddleware:
                return {
                    code: `${ResponseCodes.warning}-272`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateCompleteTeamMemberStreakTaskRetreiveTeamMembersMiddleware:
                return {
                    code: `${ResponseCodes.warning}-273`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateStreakRecommendationFromRequestMiddleware:
                return {
                    code: `${ResponseCodes.warning}-274`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SaveStreakRecommendationToDatabaseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-275`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendFormattedStreakRecommendationMiddleware:
                return {
                    code: `${ResponseCodes.warning}-276`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateIncompleteTeamMemberStreakTaskRetreiveTeamMembersMiddleware:
                return {
                    code: `${ResponseCodes.warning}-277`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendStreakRecommendationsMiddleware:
                return {
                    code: `${ResponseCodes.warning}-278`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.FindStreakRecommendationsMiddleware:
                return {
                    code: `${ResponseCodes.warning}-279`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.FindBadgesMiddleware:
                return {
                    code: `${ResponseCodes.warning}-280`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendBadgesMiddleware:
                return {
                    code: `${ResponseCodes.warning}-281`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateBadgeFromRequestMiddleware:
                return {
                    code: `${ResponseCodes.warning}-282`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendFormattedBadgeMiddleware:
                return {
                    code: `${ResponseCodes.warning}-283`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateChallengeFromRequestMiddleware:
                return {
                    code: `${ResponseCodes.warning}-284`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendFormattedChallengeMiddleware:
                return {
                    code: `${ResponseCodes.warning}-285`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.FindChallengesMiddleware:
                return {
                    code: `${ResponseCodes.warning}-286`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendChallengesMiddleware:
                return {
                    code: `${ResponseCodes.warning}-287`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.GetRetreiveChallengeMiddleware:
                return {
                    code: `${ResponseCodes.warning}-288`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendChallengeMiddleware:
                return {
                    code: `${ResponseCodes.warning}-289`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateChallengeStreakFromRequestMiddleware:
                return {
                    code: `${ResponseCodes.warning}-290`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendFormattedChallengeStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-291`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.FindChallengeStreaksMiddleware:
                return {
                    code: `${ResponseCodes.warning}-292`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendChallengeStreaksMiddleware:
                return {
                    code: `${ResponseCodes.warning}-293`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RetreiveChallengeStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-294`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendChallengeStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-295`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.ChallengeStreakExistsMiddleware:
                return {
                    code: `${ResponseCodes.warning}-296`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.EnsureChallengeStreakTaskHasNotBeenCompletedTodayMiddleware:
                return {
                    code: `${ResponseCodes.warning}-297`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateCompleteChallengeStreakTaskRetreiveUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-298`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateCompleteChallengeStreakTaskSetTaskCompleteTimeMiddleware:
                return {
                    code: `${ResponseCodes.warning}-299`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateCompleteChallengeStreakTaskSetStreakStartDateMiddleware:
                return {
                    code: `${ResponseCodes.warning}-300`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateCompleteChallengeStreakTaskSetDayTaskWasCompletedMiddleware:
                return {
                    code: `${ResponseCodes.warning}-301`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateCompleteChallengeStreakTaskDefinitionMiddleware:
                return {
                    code: `${ResponseCodes.warning}-302`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateCompleteChallengeStreakTaskStreakMaintainedMiddleware:
                return {
                    code: `${ResponseCodes.warning}-303`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateCompleteChallengeStreakTaskSendTaskCompleteResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-304`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateCompleteChallengeStreakTaskSaveTaskCompleteMiddleware:
                return {
                    code: `${ResponseCodes.warning}-305`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateIncompleteChallengeStreakTaskChallengeStreakExistsMiddleware:
                return {
                    code: `${ResponseCodes.warning}-306`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.EnsureChallengeStreakTaskHasBeenCompletedTodayMiddleware:
                return {
                    code: `${ResponseCodes.warning}-307`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateIncompleteChallengeStreakTaskRetreiveUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-308`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateIncompleteChallengeStreakTaskDefinitionMiddleware:
                return {
                    code: `${ResponseCodes.warning}-309`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.IncompleteChallengeStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-310`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendChallengeTaskIncompleteResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-311`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SaveChallengeTaskIncompleteMiddleware:
                return {
                    code: `${ResponseCodes.warning}-312`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SetDayChallengeTaskWasIncompletedMiddleware:
                return {
                    code: `${ResponseCodes.warning}-313`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SetChallengeTaskIncompleteTimeMiddleware:
                return {
                    code: `${ResponseCodes.warning}-314`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.ResetChallengeStreakStartDateMiddleware:
                return {
                    code: `${ResponseCodes.warning}-315`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.PatchChallengeStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-316`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendUpdatedChallengeStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-317`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateBadgeForChallengeMiddleware:
                return {
                    code: `${ResponseCodes.warning}-318`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.IsUserAlreadyInChallengeMiddleware:
                return {
                    code: `${ResponseCodes.warning}-319`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.AddUserToChallengeMiddleware:
                return {
                    code: `${ResponseCodes.warning}-320`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DoesChallengeExistMiddleware:
                return {
                    code: `${ResponseCodes.warning}-321`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateChallengeStreakDoesUserExistMiddleware:
                return {
                    code: `${ResponseCodes.warning}-322`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.GetChallengeMemberInformationMiddleware:
                return {
                    code: `${ResponseCodes.warning}-323`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.AddChallengeBadgeToUserBadgesMiddleware:
                return {
                    code: `${ResponseCodes.warning}-324`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.PopulateUserBadgesMiddleware:
                return {
                    code: `${ResponseCodes.warning}-325`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.PatchCurrentUserPopulateUserBadgesMiddleware:
                return {
                    code: `${ResponseCodes.warning}-326`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.ChallengeIdIsDefinedForChallengeBadgeValidationMiddleware:
                return {
                    code: `${ResponseCodes.warning}-327`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.GetUserPopulateUserBadgesMiddleware:
                return {
                    code: `${ResponseCodes.warning}-328`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendNewChallengeBadgeNotificationMiddleware:
                return {
                    code: `${ResponseCodes.warning}-329`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            default:
                return {
                    code: `${ResponseCodes.warning}-01`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };
        }
    }
}
