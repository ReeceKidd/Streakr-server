"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Streak_1 = require("../../Models/Streak");
const User_1 = require("../../Models/User");
class StreakRouter {
    static get(req, res) {
        Streak_1.default.find({}, (err, streak) => {
            if (err)
                return res.send(err);
            return res.json(streak);
        });
    }
    static getById(req, res) {
        Streak_1.default.findById(req.params.id, (err, streak) => {
            if (err)
                return res.send(err);
            return res.json(streak);
        });
    }
    static update(req, res) {
        Streak_1.default.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, streak) => {
            if (err)
                return res.send(err);
            return res.json(streak);
        });
    }
    static delete(req, res) {
        Streak_1.default.remove({ id: req.params.id }, err => {
            if (err)
                return res.send(err);
            return res.json({ message: "Successfully deleted streak" });
        });
    }
    static post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                if (body.participants.length === 0)
                    throw new Error('Validaition error');
                body.participants = yield StreakRouter.getUsersForStreak(body.participants);
                yield StreakRouter.saveStreak(body);
                res.send(body);
            }
            catch (err) {
                return res.status(500).send(err);
            }
        });
    }
    static getUsersForStreak(participants) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(participants.map((userID) => __awaiter(this, void 0, void 0, function* () {
                const matchedUser = yield User_1.default.findOne({ _id: userID });
                if (!matchedUser)
                    throw new Error(`Cannot find user with ID:${userID}`);
                return matchedUser.toObject();
            })));
        });
    }
    static saveStreak(modelToSave) {
        return __awaiter(this, void 0, void 0, function* () {
            const newStreak = new Streak_1.default(modelToSave);
            newStreak.save((err, streak) => {
                if (err)
                    throw new Error(err.message);
                return streak;
            });
        });
    }
}
exports.StreakRouter = StreakRouter;
exports.default = StreakRouter;
//# sourceMappingURL=streak.js.map