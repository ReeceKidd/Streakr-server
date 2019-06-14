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
const Collections_1 = require("./Collections");
const Models_1 = require("./Models");
exports.soloStreakSchema = new mongoose.Schema({
    userId: {
        required: true,
        type: String,
        index: true
    },
    name: {
        required: true,
        type: String,
        index: true,
    },
    description: {
        required: true,
        type: String,
    },
    timezone: {
        required: true,
        type: String
    },
    startDate: {
        type: Date,
        default: new Date(),
    },
    completedToday: {
        type: Boolean,
        default: false
    },
    currentStreak: {
        startDate: {
            type: Date,
            default: undefined
        },
        numberOfDaysInARow: {
            type: Number,
            default: 0
        },
        endDate: {
            type: Date,
            default: undefined
        }
    },
    pastStreaks: [],
}, {
    timestamps: true,
    collection: Collections_1.Collections.SoloStreaks,
});
exports.soloStreakModel = mongoose.model(Models_1.Models.SoloStreak, exports.soloStreakSchema);
//# sourceMappingURL=SoloStreak.js.map