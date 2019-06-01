"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
const supportedLanguages_1 = require("../Messages/supportedLanguages");
const Collections_1 = require("./Collections");
const Models_1 = require("./Models");
exports.SALT_ROUNDS = 10;
var UserTypes;
(function (UserTypes) {
    UserTypes["user"] = "user";
    UserTypes["admin"] = "admin";
})(UserTypes || (UserTypes = {}));
exports.userSchema = new mongoose.Schema({
    userName: {
        required: true,
        type: String,
        unique: true,
        trim: true,
        index: true,
    },
    email: {
        required: true,
        type: String,
        unique: true,
        trim: true,
        index: true,
    },
    password: {
        required: true,
        type: String
    },
    role: {
        type: String,
        enum: [UserTypes.user, UserTypes.admin],
        default: UserTypes.user,
    },
    preferredLanguage: {
        type: String,
        default: supportedLanguages_1.SupportedLanguages.EN
    },
    streaks: {
        type: Array,
        default: [],
    },
    profilePicture: {
        type: String,
    },
    friends: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: Collections_1.Collections.Users,
});
exports.userSchema.index({ userName: "text" });
exports.userSchema.index({ email: "text" });
exports.userModel = mongoose.model(Models_1.Models.User, exports.userSchema);
//# sourceMappingURL=User.js.map