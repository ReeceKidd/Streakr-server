"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = __importStar(require("nodemailer"));
exports.transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "reece@streakoid.com",
        pass: "Milkshake1"
    }
});
//# sourceMappingURL=email.js.map