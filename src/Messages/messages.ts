import { successMessages, SuccessMessageKeys } from "./successMessages";
import { failureMessages, FailureMessageKeys } from "./failureMessages";
import { MessageCategories } from "./messageCategories";

export type MessageKeys = SuccessMessageKeys | FailureMessageKeys

export const messages = {
    [MessageCategories.successMessages]: successMessages,
    [MessageCategories.failureMessages]: failureMessages
}
