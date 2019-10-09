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
    TaskAlreadyCompletedToday,
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
    SetUserTypeToPremiumMiddleware,
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
    SendRetreiveUserResponseMiddleware,
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
    CreateGroupMemberStreakFromRequestMiddleware,
    SaveGroupMemberStreakToDatabaseMiddleware,
    SendFormattedGroupMemberStreakMiddleware,
    CreateGroupMemberStreakRetreiveUserMiddleware,
    CreateGroupMemberStreakUserDoesNotExist,
    CreateGroupMemberStreakTeamStreakDoesNotExist,
    CreateGroupMemberStreakRetreiveTeamStreakMiddleware,
    DeleteGroupMemberStreakMiddleware,
    SendGroupMemberStreakDeletedResponseMiddleware,
    NoGroupMemberStreakToDeleteFound,
    GroupMemberStreakExistsMiddleware,
    CreateCompleteGroupMemberStreakTaskRetreiveUserMiddleware,
    SetGroupMemberStreakTaskCompleteTimeMiddleware,
    SetGroupMemberStreakStartDateMiddleware,
    SetDayGroupMemberStreakTaskWasCompletedMiddleware,
    HasGroupMemberStreakTaskAlreadyBeenCompletedTodayMiddleware,
    SaveGroupMemberStreakTaskCompleteMiddleware,
    GroupMemberStreakMaintainedMiddleware,
    SendCompleteGroupMemberStreakTaskResponseMiddleware,
    GroupMemberStreakTaskAlreadyCompletedToday,
    GroupMemberStreakDoesNotExist,
    CreateCompleteGroupMemberStreakTaskDefinitionMiddleware,
    RetreiveGroupMemberStreakMiddleware,
    SendGroupMemberStreakMiddleware,
    GetGroupMemberStreakNoGroupMemberStreakFound,
    TeamStreakDoesNotExist,
    TeamStreakExistsMiddleware,
    CreateCompleteGroupMemberStreakTaskMiddleware,
    DeleteCompleteGroupMemberStreakTaskMiddleware,
    SendCompleteGroupMemberStreakTaskDeletedResponseMiddleware,
    NoCompleteGroupMemberStreakTaskToDeleteFound,
    GetCompleteGroupMemberStreakTasksMiddleware,
    SendCompleteGroupMemberStreakTasksResponseMiddleware,
    CreateTeamStreakCreateMemberStreakMiddleware,
    GroupMemberDoesNotExist,
    UpdateTeamStreakMembersArray,
    PatchTeamStreakMiddleware,
    SendUpdatedTeamStreakMiddleware,
    UpdatedTeamStreakNotFound,
    CreateGroupMemberFriendExistsMiddleware,
    CreateGroupMemberTeamStreakExistsMiddleware,
    SendCreateGroupMemberResponseMiddleware,
    CreateGroupMemberFriendDoesNotExist,
    CreateGroupMemberTeamStreakDoesNotExist,
    CreateGroupMemberCreateGroupMemberStreakMiddleware,
    AddFriendToTeamStreakMiddleware,
    DeleteGroupMemberRetreiveTeamStreakMiddleware,
    RetreiveGroupMemberMiddleware,
    DeleteGroupMemberMiddleware,
    SendGroupMemberDeletedResponseMiddleware,
    NoTeamStreakFound,
    NoGroupMemberFound,
    FindGroupMemberStreaksMiddleware,
    SendGroupMemberStreaksMiddleware,
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
}

const internalServerMessage = 'Internal Server Error.';

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

            case ErrorType.CreateGroupMemberStreakUserDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-30`,
                    message: 'User does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.CreateGroupMemberStreakTeamStreakDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-31`,
                    message: 'Team streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.NoGroupMemberStreakToDeleteFound: {
                return {
                    code: `${ResponseCodes.badRequest}-32`,
                    message: 'Group member streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.GroupMemberStreakDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-33`,
                    message: 'Group member streak does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.GetGroupMemberStreakNoGroupMemberStreakFound: {
                return {
                    code: `${ResponseCodes.badRequest}-34`,
                    message: 'Group member streak does not exist.',
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

            case ErrorType.NoCompleteGroupMemberStreakTaskToDeleteFound: {
                return {
                    code: `${ResponseCodes.badRequest}-36`,
                    message: 'Group member streak task does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.GroupMemberDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-37`,
                    message: 'Group member does not exist.',
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

            case ErrorType.CreateGroupMemberFriendDoesNotExist: {
                return {
                    code: `${ResponseCodes.badRequest}-39`,
                    message: 'Friend does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };
            }

            case ErrorType.CreateGroupMemberTeamStreakDoesNotExist: {
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

            case ErrorType.NoGroupMemberFound: {
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

            case ErrorType.TaskAlreadyCompletedToday: {
                return {
                    code: `${ResponseCodes.unprocessableEntity}-01`,
                    message: 'Task already completed today.',
                    httpStatusCode: ResponseCodes.unprocessableEntity,
                };
            }

            case ErrorType.GroupMemberStreakTaskAlreadyCompletedToday: {
                return {
                    code: `${ResponseCodes.unprocessableEntity}-02`,
                    message: 'Task already completed today.',
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

            case ErrorType.SetUserTypeToPremiumMiddleware:
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

            case ErrorType.SendRetreiveUserResponseMiddleware:
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

            case ErrorType.CreateGroupMemberStreakFromRequestMiddleware:
                return {
                    code: `${ResponseCodes.warning}-110`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SaveGroupMemberStreakToDatabaseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-111`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendFormattedGroupMemberStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-112`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateGroupMemberStreakRetreiveUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-113`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateGroupMemberStreakRetreiveTeamStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-114`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DeleteGroupMemberStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-115`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendGroupMemberStreakDeletedResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-116`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.GroupMemberStreakExistsMiddleware:
                return {
                    code: `${ResponseCodes.warning}-117`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateCompleteGroupMemberStreakTaskRetreiveUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-118`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SetGroupMemberStreakTaskCompleteTimeMiddleware:
                return {
                    code: `${ResponseCodes.warning}-119`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SetGroupMemberStreakStartDateMiddleware:
                return {
                    code: `${ResponseCodes.warning}-120`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SetDayGroupMemberStreakTaskWasCompletedMiddleware:
                return {
                    code: `${ResponseCodes.warning}-121`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.HasGroupMemberStreakTaskAlreadyBeenCompletedTodayMiddleware:
                return {
                    code: `${ResponseCodes.warning}-122`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SaveGroupMemberStreakTaskCompleteMiddleware:
                return {
                    code: `${ResponseCodes.warning}-123`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.GroupMemberStreakMaintainedMiddleware:
                return {
                    code: `${ResponseCodes.warning}-124`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendCompleteGroupMemberStreakTaskResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-125`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateCompleteGroupMemberStreakTaskDefinitionMiddleware:
                return {
                    code: `${ResponseCodes.warning}-126`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RetreiveGroupMemberStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-127`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendGroupMemberStreakMiddleware:
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

            case ErrorType.CreateCompleteGroupMemberStreakTaskMiddleware:
                return {
                    code: `${ResponseCodes.warning}-130`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DeleteCompleteGroupMemberStreakTaskMiddleware:
                return {
                    code: `${ResponseCodes.warning}-131`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendCompleteGroupMemberStreakTaskDeletedResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-132`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.GetCompleteGroupMemberStreakTasksMiddleware:
                return {
                    code: `${ResponseCodes.warning}-133`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendCompleteGroupMemberStreakTasksResponseMiddleware:
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

            case ErrorType.CreateGroupMemberFriendExistsMiddleware:
                return {
                    code: `${ResponseCodes.warning}-139`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateGroupMemberTeamStreakExistsMiddleware:
                return {
                    code: `${ResponseCodes.warning}-140`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendCreateGroupMemberResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-141`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateGroupMemberCreateGroupMemberStreakMiddleware:
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

            case ErrorType.DeleteGroupMemberRetreiveTeamStreakMiddleware:
                return {
                    code: `${ResponseCodes.warning}-144`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RetreiveGroupMemberMiddleware:
                return {
                    code: `${ResponseCodes.warning}-145`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.DeleteGroupMemberMiddleware:
                return {
                    code: `${ResponseCodes.warning}-146`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendGroupMemberDeletedResponseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-147`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.FindGroupMemberStreaksMiddleware:
                return {
                    code: `${ResponseCodes.warning}-148`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendGroupMemberStreaksMiddleware:
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

            default:
                return {
                    code: `${ResponseCodes.warning}-01`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };
        }
    }
}
