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
                [FailureMessageKeys.loginUnsuccessfulMessage]: 'Login unsuccessful',
                [FailureMessageKeys.userDoesNotExistMessage]: 'Unsuccessful',
                [FailureMessageKeys.invalidTokenMessage]: 'Invalid token',
                [FailureMessageKeys.missingJsonWebTokenMessage]: 'JSON web token is missing from header'
        }
}