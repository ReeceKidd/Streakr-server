import { supportedLanguages } from "./supportedLanguages";

export enum SuccessMessageKeys {
    loginSuccessMessage = "loginSuccessMessage",
    jsonWebTokenVerificationSuccessfulMessage = "jsonWebTokenVerificationSuccessfulMessage",
    successfullyAddedFriend = "successfullyAddedFriend"
}

export const successMessages = {
    [supportedLanguages.EN]: {
        [SuccessMessageKeys.loginSuccessMessage]: "Successfully logged in",
        [SuccessMessageKeys.jsonWebTokenVerificationSuccessfulMessage]: "Json Web Token verfied correctly",
        [SuccessMessageKeys.successfullyAddedFriend]: "Successfully added friend"
    }
};


