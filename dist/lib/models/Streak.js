"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
exports.StreakSchema = new Schema({
    streakName: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String,
    },
    createdBy: {
        required: true,
        type: String
    },
    participants: {
        required: true,
        type: String
    },
    duration: {
        required: true,
        type: String
    },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    collection: 'Streaks'
});
exports.default = mongoose.model('Streak', exports.StreakSchema);
//# sourceMappingURL=Streak.js.map