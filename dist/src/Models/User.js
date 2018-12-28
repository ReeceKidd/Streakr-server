"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.SALT_ROUNDS = 10;
exports.UserSchema = new mongoose.Schema({
    userName: {
        required: true,
        type: String,
        unique: true,
        trim: true,
        index: true
    },
    email: {
        required: true,
        type: String,
        unique: true,
        trim: true,
        index: true,
        select: false
    },
    password: {
        required: true,
        type: String,
        select: false
    },
    streaks: {
        type: Array,
        default: []
    },
    profilePicture: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'Users'
});
mongoose.set('useCreateIndex', true);
exports.UserSchema.index({ userName: "text" });
exports.UserSchema.index({ email: "text" });
exports.UserModel = mongoose.model("User", exports.UserSchema);
//# sourceMappingURL=User.js.map