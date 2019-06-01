"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supportedLanguages_1 = require("./supportedLanguages");
var SuccessMessageKeys;
(function (SuccessMessageKeys) {
    SuccessMessageKeys["loginSuccessMessage"] = "loginSuccessMessage";
    SuccessMessageKeys["jsonWebTokenVerificationSuccessfulMessage"] = "jsonWebTokenVerificationSuccessfulMessage";
    SuccessMessageKeys["successfullyAddedFriend"] = "successfullyAddedFriend";
})(SuccessMessageKeys = exports.SuccessMessageKeys || (exports.SuccessMessageKeys = {}));
exports.successMessages = {
    [supportedLanguages_1.supportedLanguages.EN]: {
        [SuccessMessageKeys.loginSuccessMessage]: "Successfully logged in",
        [SuccessMessageKeys.jsonWebTokenVerificationSuccessfulMessage]: "Json Web Token verfied correctly",
        [SuccessMessageKeys.successfullyAddedFriend]: "Successfully added friend"
    }
};
//# sourceMappingURL=successMessages.js.map