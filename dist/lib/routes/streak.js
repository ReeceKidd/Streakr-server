"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Streak_1 = require("../models/Streak");
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
        Streak_1.default.remove({ id: req.params.id }, (err) => {
            if (err)
                return res.send(err);
            return res.json({ message: 'Successfully deleted streak' });
        });
    }
    static post(req, res) {
        const newStreak = new Streak_1.default(req.body);
        newStreak.save((err, user) => {
            if (err)
                return res.send(err);
            return res.json(user);
        });
    }
}
exports.StreakRouter = StreakRouter;
exports.default = StreakRouter;
//# sourceMappingURL=streak.js.map