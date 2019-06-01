"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const email_1 = require("../../config/email");
if (!email_1.transporter) {
    throw new Error("You need to configure an email transporter. ");
}
exports.emailTransporter = email_1.transporter;
//# sourceMappingURL=emailTransporter.js.map