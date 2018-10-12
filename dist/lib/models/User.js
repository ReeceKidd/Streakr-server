"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String
    },
    userName: {
        required: true,
        type: String,
        unique: true
    },
    email: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String
    },
    comparePassword: {
        required: true,
        type: String
    },
    streaks: {
        type: Object,
        default: []
    }
}, {
    collection: 'Users'
});
exports.default = mongoose.model('User', UserSchema);
//# sourceMappingURL=User.js.map