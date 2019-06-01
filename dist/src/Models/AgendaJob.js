"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Models_1 = require("./Models");
const Collections_1 = require("./Collections");
exports.agendaJobSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    data: {},
    type: {
        type: String,
    },
    nextRunAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    lastModifiedBy: {
        type: String,
    },
    lockedAt: {
        type: Date,
        index: true
    },
    lastFinishedAt: Date
}, {
    collection: Collections_1.Collections.AgendaJobs
});
exports.agendaJobSchema.index({ "data.timezone": "text" });
exports.agendaJobModel = mongoose_1.default.model(Models_1.Models.AgendaJob, exports.agendaJobSchema);
//# sourceMappingURL=AgendaJob.js.map