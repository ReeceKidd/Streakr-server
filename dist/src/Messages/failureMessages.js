"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supportedLanguages_1 = require("./supportedLanguages");
const headers_1 = require("../../src/Server/headers");
var FailureMessageKeys;
(function (FailureMessageKeys) {
    FailureMessageKeys["taskAlreadyCompleted"] = "taskAlreadyCompleted";
    FailureMessageKeys["loginUnsuccessfulMessage"] = "loginUnsuccessfulMessage";
    FailureMessageKeys["userDoesNotExistMessage"] = "userDoesNotExistMessage";
    FailureMessageKeys["soloStreakDoesNotExist"] = "soloStreakDoesNotExist";
    FailureMessageKeys["invalidTokenMessage"] = "invalidTokenMessage";
    FailureMessageKeys["missingJsonWebTokenMessage"] = "missingJsonWebTokenMessage";
    FailureMessageKeys["missingTimezoneHeaderMessage"] = "missingTimezoneMessage";
    FailureMessageKeys["invalidTimezoneMessage"] = "invalidTimezoneMessage";
    FailureMessageKeys["unauthorisedMessage"] = "Unauthorized";
    FailureMessageKeys["friendAlreadyExists"] = "friendAlreadyExists";
})(FailureMessageKeys = exports.FailureMessageKeys || (exports.FailureMessageKeys = {}));
exports.failureMessages = {
    [supportedLanguages_1.supportedLanguages.EN]: {
        [FailureMessageKeys.taskAlreadyCompleted]: "Task has already been completed today",
        [FailureMessageKeys.unauthorisedMessage]: "Unauthorized",
        [FailureMessageKeys.loginUnsuccessfulMessage]: "Login unsuccessful",
        [FailureMessageKeys.userDoesNotExistMessage]: "User does not exist",
        [FailureMessageKeys.soloStreakDoesNotExist]: "Solo streak does not exsit",
        [FailureMessageKeys.missingTimezoneHeaderMessage]: `Missing ${headers_1.SupportedRequestHeaders.xTimezone} header in request`,
        [FailureMessageKeys.invalidTimezoneMessage]: `Timezone is invalid`,
        [FailureMessageKeys.invalidTokenMessage]: "Invalid token",
        [FailureMessageKeys.missingJsonWebTokenMessage]: "JSON web token is missing from header",
        [FailureMessageKeys.friendAlreadyExists]: "Friend already exists"
    }
};
//# sourceMappingURL=failureMessages.js.map