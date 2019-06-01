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
const Models_1 = require("./Models");
const Collections_1 = require("./Collections");
var TypesOfStreak;
(function (TypesOfStreak) {
    TypesOfStreak["soloStreak"] = "solo-streak";
})(TypesOfStreak = exports.TypesOfStreak || (exports.TypesOfStreak = {}));
exports.completeTaskSchema = new mongoose.Schema({
    streakId: {
        required: true,
        type: String
    },
    userId: {
        required: true,
        type: String
    },
    taskCompleteTime: {
        required: true,
        type: Date
    },
    taskCompleteDay: {
        required: true,
        type: String
    },
    streakType: {
        required: true,
        type: String,
    }
}, {
    timestamps: true,
    collection: Collections_1.Collections.CompleteTasks,
});
exports.completeTaskSchema.index({ userId: 1, streakId: 1, taskCompleteDay: 1 }, { unique: true });
exports.completeTaskModel = mongoose.model(Models_1.Models.CompleteTask, exports.completeTaskSchema);
//# sourceMappingURL=CompleteTask.js.map