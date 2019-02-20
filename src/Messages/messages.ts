import { successMessages, SuccessMessageKeys } from "./successMessages";
import { failureMessages, FailureMessageKeys } from "./failureMessages";

export enum MessageCategories {
    successMessages = 'successMessages',
    failureMessages = 'failureMessages'
}

export type MessageKeys = SuccessMessageKeys | FailureMessageKeys

export const messages = {
    [MessageCategories.successMessages]: successMessages,
    [MessageCategories.failureMessages]: failureMessages
}
