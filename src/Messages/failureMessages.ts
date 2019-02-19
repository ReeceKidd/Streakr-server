import { supportedLanguages } from "./supportedLanguages";

export const failureMessages = {
    [supportedLanguages.EN]: {
        loginUnsuccessfulMessage: 'Login unsuccessful',
        userDoesNotExistMessage: 'User does not exist',
        invalidTokenMessage: 'Invalid token',
        missingJsonWebTokenMessage: 'JSON web token is missing from header'
    }
}