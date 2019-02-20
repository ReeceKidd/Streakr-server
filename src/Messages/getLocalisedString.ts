import { supportedLanguages, SupportedLanguages } from "./supportedLanguages";
import { messages, MessageCategories, MessageKeys } from "./messages";

export const getLocalisedString = (parent: MessageCategories, key: MessageKeys, language: SupportedLanguages = supportedLanguages.EN) => {
    return messages[parent][language][key]
}