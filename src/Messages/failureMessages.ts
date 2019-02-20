import { supportedLanguages } from "./supportedLanguages";

export enum FailureMessageKeys {
        loginUnsuccessfulMessage = 'loginUnsuccessfulMessage',
        userDoesNotExistMessage = 'userDoesNotExistMessage',
        invalidTokenMessage = 'invalidTokenMessage',
        missingJsonWebTokenMessage = 'missingJsonWebTokenMessage'
}

export const failureMessages = {
        [supportedLanguages.EN]: {
                [FailureMessageKeys.loginUnsuccessfulMessage]: 'Login unsuccessful',
                [FailureMessageKeys.userDoesNotExistMessage]: 'User does not exist',
                [FailureMessageKeys.invalidTokenMessage]: 'Invalid token',
                [FailureMessageKeys.missingJsonWebTokenMessage]: 'JSON web token is missing from header'
        }
}