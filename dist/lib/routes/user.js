"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
class UserRouter {
    static get(req, res) {
        const defaultUndefinedValue = { '$ne': null };
        const firstName = req.query.firstName || defaultUndefinedValue;
        const lastName = req.query.lastName || defaultUndefinedValue;
        const email = req.query.email || defaultUndefinedValue;
        User_1.default.find({ firstName, lastName, email }, (err, users) => {
            if (err)
                return res.send(err);
            return res.json(users);
        });
    }
    static getById(req, res) {
        User_1.default.findById(req.params.id, (err, user) => {
            if (err)
                return res.send(err);
            return res.json(user);
        });
    }
    static update(req, res) {
        User_1.default.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, user) => {
            if (err)
                return res.send(err);
            return res.json(user);
        });
    }
    static delete(req, res) {
        User_1.default.remove({ id: req.params.id }, (err) => {
            if (err)
                return res.send(err);
            return res.json({ message: 'Successfully deleted user' });
        });
    }
    static post(req, res) {
        const newUser = new User_1.default(req.body);
        newUser.save((err, user) => {
            if (err)
                return res.send(err);
            return res.json(user);
        });
    }
}
exports.UserRouter = UserRouter;
exports.default = UserRouter;
//# sourceMappingURL=user.js.map