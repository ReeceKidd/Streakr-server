"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const successMessages_1 = require("./successMessages");
const failureMessages_1 = require("./failureMessages");
const messageCategories_1 = require("./messageCategories");
exports.messages = {
    [messageCategories_1.MessageCategories.successMessages]: successMessages_1.successMessages,
    [messageCategories_1.MessageCategories.failureMessages]: failureMessages_1.failureMessages
};
//# sourceMappingURL=messages.js.map