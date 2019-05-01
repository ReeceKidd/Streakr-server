import { supportedLanguages } from "./supportedLanguages";
import { SupportedRequestHeaders } from "../../src/Server/headers";

export enum FailureMessageKeys {
        taskAlreadyCompleted = 'taskAlreadyCompleted',
        loginUnsuccessfulMessage = 'loginUnsuccessfulMessage',
        userDoesNotExistMessage = 'userDoesNotExistMessage',
        soloStreakDoesNotExistMessage = 'soloStreakDoesNotExistMessage',
        invalidTokenMessage = 'invalidTokenMessage',
        missingJsonWebTokenMessage = 'missingJsonWebTokenMessage',
        missingTimeZoneHeaderMessage = 'missingTimeZoneMessage',
        invalidTimeZoneMessage = 'invalidTimeZoneMessage',
        unauthorisedMessage = 'Unauthorized',
        friendAlreadyExists = 'friendAlreadyExists'
}

export const failureMessages = {
        [supportedLanguages.EN]: {
                [FailureMessageKeys.taskAlreadyCompleted]: 'Task has already been completed today',
                [FailureMessageKeys.unauthorisedMessage]: 'Unauthorized',
                [FailureMessageKeys.loginUnsuccessfulMessage]: 'Login unsuccessful',
                [FailureMessageKeys.userDoesNotExistMessage]: 'Unsuccessful',
                [FailureMessageKeys.soloStreakDoesNotExistMessage]: 'SoloStreak does not exist',
                [FailureMessageKeys.missingTimeZoneHeaderMessage]: `Missing ${SupportedRequestHeaders.xTimeZone} header in request`,
                [FailureMessageKeys.invalidTimeZoneMessage]: `Timezone is invalid`,
                [FailureMessageKeys.invalidTokenMessage]: 'Invalid token',
                [FailureMessageKeys.missingJsonWebTokenMessage]: 'JSON web token is missing from header',
                [FailureMessageKeys.friendAlreadyExists]: 'Friend already exists'
        }
}