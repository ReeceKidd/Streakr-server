import { supportedLanguages, SupportedLanguages } from "./supportedLanguages";
import { messages, MessageKeys } from "./messages";
import { MessageCategories } from "./messageCategories";

export const getLocalisedString = (
  messageCategory: MessageCategories,
  messageKey: MessageKeys,
  language: SupportedLanguages = supportedLanguages.EN
): string => {
  // @ts-ignore
  return messages[messageCategory][language][messageKey];
};
