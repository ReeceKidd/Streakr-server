"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supportedLanguages_1 = require("./supportedLanguages");
const messages_1 = require("./messages");
exports.getLocalisedString = (messageCategory, messageKey, language = supportedLanguages_1.supportedLanguages.EN) => {
    return messages_1.messages[messageCategory][language][messageKey];
};
//# sourceMappingURL=getLocalisedString.js.map