import { supportedLanguages } from "./supportedLanguages";
import { SupportedRequestHeaders } from "../../src/Server/headers";

export enum FailureMessageKeys {
        taskAlreadyCompleted = "taskAlreadyCompleted",
        loginUnsuccessfulMessage = "loginUnsuccessfulMessage",
        userDoesNotExistMessage = "userDoesNotExistMessage",
        soloStreakDoesNotExist = "soloStreakDoesNotExist",
        invalidTokenMessage = "invalidTokenMessage",
        missingJsonWebTokenMessage = "missingJsonWebTokenMessage",
        missingTimezoneHeaderMessage = "missingTimezoneMessage",
        invalidTimezoneMessage = "invalidTimezoneMessage",
        unauthorisedMessage = "Unauthorized",
        friendAlreadyExists = "friendAlreadyExists"
}

export const failureMessages = {
        [supportedLanguages.EN]: {
                [FailureMessageKeys.taskAlreadyCompleted]: "Task has already been completed today",
                [FailureMessageKeys.unauthorisedMessage]: "Unauthorized",
                [FailureMessageKeys.loginUnsuccessfulMessage]: "Login unsuccessful",
                [FailureMessageKeys.userDoesNotExistMessage]: "User does not exist",
                [FailureMessageKeys.soloStreakDoesNotExist]: "Solo streak does not exsit",
                [FailureMessageKeys.missingTimezoneHeaderMessage]: `Missing ${SupportedRequestHeaders.xTimezone} header in request`,
                [FailureMessageKeys.invalidTimezoneMessage]: `Timezone is invalid`,
                [FailureMessageKeys.invalidTokenMessage]: "Invalid token",
                [FailureMessageKeys.missingJsonWebTokenMessage]: "JSON web token is missing from header",
                [FailureMessageKeys.friendAlreadyExists]: "Friend already exists"
        }
};