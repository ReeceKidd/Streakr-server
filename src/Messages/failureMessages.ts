import { supportedLanguages } from "./supportedLanguages";

export enum FailureMessageKeys {
        loginUnsuccessfulMessage = 'loginUnsuccessfulMessage',
        userDoesNotExistMessage = 'userDoesNotExistMessage',
        invalidTokenMessage = 'invalidTokenMessage',
        missingJsonWebTokenMessage = 'missingJsonWebTokenMessage',
        unauthorisedMessage = 'Unauthorized'
}

export const failureMessages = {
        [supportedLanguages.EN]: {
                [FailureMessageKeys.unauthorisedMessage]: 'Unauthorized',
                [FailureMessageKeys.missingJsonWebTokenMessage]: 'JSON web token is missing from header'
        }
}