import { supportedLanguages } from "./supportedLanguages";

export enum SuccessMessageKeys {
    loginSuccessMessage = 'loginSuccessMessage',
    jsonWebTokenVerificationSuccessfulMessage = 'jsonWebTokenVerificationSuccessfulMessage'
}

export const successMessages = {
    [supportedLanguages.EN]: {
        [SuccessMessageKeys.loginSuccessMessage]: 'Successfully logged in',
        [SuccessMessageKeys.jsonWebTokenVerificationSuccessfulMessage]: 'Json Web Token verfied correctly'
    }
}


